"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Code, Palette, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

// Monaco Editor component (simplified for demo)
function MonacoEditor({
  value,
  language,
  onChange,
}: {
  value: string
  language: string
  onChange?: (value: string) => void
}) {
  return (
    <div className="h-full bg-card text-card-foreground p-4 font-mono text-sm overflow-auto rounded-lg">
      <pre className="whitespace-pre-wrap">{value}</pre>
    </div>
  )
}

export function CodeEditor() {
  const { currentSession, activeTab, setActiveTab, updateComponent } = useAppStore()
  const { toast } = useToast()
  const [tsxCode, setTsxCode] = useState("")
  const [cssCode, setCssCode] = useState("")

  const currentComponent = currentSession?.currentComponent

  useEffect(() => {
    if (currentComponent) {
      setTsxCode(currentComponent.tsx)
      setCssCode(currentComponent.css)
    }
  }, [currentComponent])

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async () => {
    if (!currentComponent) return

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component: currentComponent,
          sessionId: currentSession?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to export component")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentComponent.name.toLowerCase().replace(/\s+/g, "-")}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success!",
        description: "Component exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export component",
        variant: "destructive",
      })
    }
  }

  const handleCodeChange = (type: "tsx" | "css", value: string) => {
    if (!currentComponent) return

    if (type === "tsx") {
      setTsxCode(value)
      updateComponent(currentComponent.id, { tsx: value })
    } else {
      setCssCode(value)
      updateComponent(currentComponent.id, { css: value })
    }
  }

  if (!currentComponent) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2 text-foreground">No Component Selected</h3>
          <p className="text-sm">Start a chat to generate your first component</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background border-r border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">{currentComponent.name}</h2>
          <p className="text-sm text-muted-foreground">Generated {new Date(currentComponent.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleCopy(activeTab === "tsx" ? tsxCode : cssCode)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Export ZIP
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="tsx" className="gap-2">
            <Code className="h-4 w-4" />
            TSX
          </TabsTrigger>
          <TabsTrigger value="css" className="gap-2">
            <Palette className="h-4 w-4" />
            CSS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 m-4 mt-2">
          <div className="h-full bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground mb-4">Live preview will be shown in the preview panel →</p>
          </div>
        </TabsContent>

        <TabsContent value="tsx" className="flex-1 m-4 mt-2">
          <div className="h-full rounded-lg border border-border overflow-hidden">
            <MonacoEditor value={tsxCode} language="typescript" onChange={(value) => handleCodeChange("tsx", value)} />
          </div>
        </TabsContent>

        <TabsContent value="css" className="flex-1 m-4 mt-2">
          <div className="h-full rounded-lg border border-border overflow-hidden">
            <MonacoEditor value={cssCode} language="css" onChange={(value) => handleCodeChange("css", value)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
