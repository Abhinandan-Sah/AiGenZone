#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

function setupEnvironment() {
  console.log("🚀 Setting up AI Component Generator (AiGenZone)...\n")

  // Check if .env.local already exists
  const envPath = path.join(process.cwd(), ".env.local")
  if (fs.existsSync(envPath)) {
    console.log("⚠️  .env.local already exists. Skipping environment setup.")
    console.log('   Run "npm run check-env" to verify your configuration.\n')
    return
  }

  // Copy template
  const templatePath = path.join(process.cwd(), ".env.local.example")
  if (!fs.existsSync(templatePath)) {
    console.log("❌ .env.local.example not found!")
    console.log("   Please ensure the template file exists.\n")
    process.exit(1)
  }

  // Read template
  let envContent = fs.readFileSync(templatePath, "utf8")

  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(32).toString("hex")
  envContent = envContent.replace("your-super-secret-jwt-key-at-least-32-characters-long", jwtSecret)

  // Write .env.local
  fs.writeFileSync(envPath, envContent)

  console.log("✅ Created .env.local from template")
  console.log("🔑 Generated JWT_SECRET automatically")
  console.log("\n📝 Next steps:")
  console.log("   1. Edit .env.local and add your API keys:")
  console.log("      - NEXT_PUBLIC_SUPABASE_URL")
  console.log("      - NEXT_PUBLIC_SUPABASE_ANON_KEY")
  console.log("      - GOOGLE_GENERATIVE_AI_API_KEY")
  console.log('\n   2. Run "npm run check-env" to verify your setup')
  console.log('   3. Run "npm run dev" to start the development server')
  console.log("\n📚 See ENV_SETUP.md for detailed setup instructions.\n")
}

// Run setup
setupEnvironment()
