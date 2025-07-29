"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Code, Palette, Eye, Maximize2, Minimize2 } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

// Monaco Editor component (enhanced)
function MonacoEditor({
  value,
  language,
  onChange,
  readOnly = false,
}: {
  value: string
  language: string
  onChange?: (value: string) => void
  readOnly?: boolean
}) {
  return (
    <div className="h-full bg-card/50 backdrop-blur-sm text-card-foreground p-4 font-mono text-sm overflow-auto rounded-lg border border-border/50">
      <pre className="whitespace-pre-wrap leading-relaxed">{value}</pre>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function CodeEditor() {
  const { currentSession, activeTab, setActiveTab, updateComponent } = useAppStore()
  const [tsxCode, setTsxCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentComponent = currentSession?.currentComponent

  useEffect(() => {
    if (currentComponent) {
      setIsLoading(true)
      // Simulate loading delay for better UX
      setTimeout(() => {
        setTsxCode(currentComponent.tsx)
        setCssCode(currentComponent.css)
        setIsLoading(false)
      }, 300)
    }
  }, [currentComponent])

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success("Code copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy code")
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

      toast.success("Component exported successfully!")
    } catch (error) {
      toast.error("Failed to export component")
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
      <motion.div
        className="flex-1 flex items-center justify-center bg-background/50 backdrop-blur-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-foreground">No Component Selected</h3>
          <p className="text-sm text-muted-foreground">Start a chat to generate your first component</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`flex flex-col bg-background/50 backdrop-blur-sm border-r border-border/50 ${
        isFullscreen ? "fixed inset-0 z-50" : "flex-1"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-violet-500/5 to-emerald-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{currentComponent.name}</h2>
              <p className="text-sm text-muted-foreground">
                Generated {new Date(currentComponent.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-violet-500/10 text-violet-600 border-violet-500/20">
              React
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              TypeScript
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(activeTab === "tsx" ? tsxCode : cssCode)}
            className="border-border/50 hover:bg-muted/50"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-border/50 hover:bg-muted/50 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export ZIP
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="border-border/50 hover:bg-muted/50"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30 backdrop-blur-sm">
            <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-background/80">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="tsx" className="gap-2 data-[state=active]:bg-background/80">
              <Code className="h-4 w-4" />
              TSX
            </TabsTrigger>
            <TabsTrigger value="css" className="gap-2 data-[state=active]:bg-background/80">
              <Palette className="h-4 w-4" />
              CSS
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-6 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="h-full"
            >
              <TabsContent value="preview" className="h-full m-0">
                <Card className="h-full bg-card/30 backdrop-blur-sm border-border/50 p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Live preview will be shown in the preview panel →
                  </p>
                  <div className="h-32 bg-gradient-to-br from-violet-500/10 to-emerald-500/10 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                    <p className="text-muted-foreground">Preview available in right panel</p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="tsx" className="h-full m-0">
                <Card className="h-full border-border/50 overflow-hidden">
                  {isLoading ? (
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : (
                    <MonacoEditor
                      value={tsxCode}
                      language="typescript"
                      onChange={(value) => handleCodeChange("tsx", value)}
                    />
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="css" className="h-full m-0">
                <Card className="h-full border-border/50 overflow-hidden">
                  {isLoading ? (
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                    <MonacoEditor value={cssCode} language="css" onChange={(value) => handleCodeChange("css", value)} />
                  )}
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </motion.div>
  )
}
