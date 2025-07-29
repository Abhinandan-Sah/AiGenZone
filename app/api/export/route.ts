import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import archiver from "archiver"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { component } = await request.json()

    if (!component) {
      return NextResponse.json({ error: "Component data required" }, { status: 400 })
    }

    // Create a zip archive
    const archive = archiver("zip", { zlib: { level: 9 } })
    const chunks: Buffer[] = []

    // Collect archive data
    archive.on("data", (chunk) => chunks.push(chunk))
    archive.on("error", (err) => {
      throw err
    })

    // Add component files to archive
    const componentName = component.name.toLowerCase().replace(/\s+/g, "-")

    // Add TSX file
    archive.append(component.tsx, { name: `${componentName}.tsx` })

    // Add CSS file
    archive.append(component.css, { name: `${componentName}.module.css` })

    // Add package.json
    const packageJson = {
      name: componentName,
      version: "1.0.0",
      description: `Generated component: ${component.name}`,
      main: `${componentName}.tsx`,
      dependencies: {
        react: "^18.0.0",
        "@types/react": "^18.0.0",
        typescript: "^5.0.0",
      },
    }
    archive.append(JSON.stringify(packageJson, null, 2), { name: "package.json" })

    // Add README
    const readme = `# ${component.name}

Generated React component using AI Frontend Generator.

## Usage

\`\`\`tsx
import ${component.name} from './${componentName}'
import styles from './${componentName}.module.css'

function App() {
  return <${component.name} />
}
\`\`\`

## Files

- \`${componentName}.tsx\` - Main component file
- \`${componentName}.module.css\` - Component styles
- \`package.json\` - Package configuration

Generated on: ${new Date().toISOString()}
`
    archive.append(readme, { name: "README.md" })

    // Finalize the archive
    await archive.finalize()

    // Wait for all data to be collected
    await new Promise((resolve) => {
      archive.on("end", resolve)
    })

    // Create response with zip data
    const zipBuffer = Buffer.concat(chunks)

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${componentName}.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Export API error:", error)
    return NextResponse.json({ error: "Failed to export component" }, { status: 500 })
  }
}
