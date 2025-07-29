"use client"

import { useAppStore } from "@/lib/store"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Smartphone, Tablet, Monitor, Eye, Maximize2, Minimize2 } from "lucide-react"
import { toast } from "sonner"

const containerVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2,
    },
  },
}

const previewVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function PreviewPanel() {
  const { currentSession } = useAppStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [viewportSize, setViewportSize] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentComponent = currentSession?.currentComponent

  const refreshPreview = () => {
    setIsRefreshing(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("Preview refreshed!")
    }, 500)
  }

  const getViewportWidth = () => {
    switch (viewportSize) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      case "desktop":
        return "100%"
    }
  }

  const getViewportHeight = () => {
    switch (viewportSize) {
      case "mobile":
        return "667px"
      case "tablet":
        return "1024px"
      case "desktop":
        return "100%"
    }
  }

  useEffect(() => {
    if (currentComponent && iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document

      if (doc) {
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Component Preview</title>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                min-height: 100vh;
              }
              .preview-container {
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                border: 1px solid rgba(0, 0, 0, 0.05);
              }
              ${currentComponent.css}
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              const { useState, useEffect } = React;
              
              ${currentComponent.tsx}
              
              const App = () => {
                return (
                  <div className="preview-container">
                    <GeneratedComponent />
                  </div>
                );
              };
              
              ReactDOM.render(<App />, document.getElementById('root'));
            </script>
          </body>
          </html>
        `)
        doc.close()
      }
    }
  }, [currentComponent])

  if (!currentComponent) {
    return (
      <motion.div
        className="w-96 bg-card/50 backdrop-blur-xl flex items-center justify-center border-l border-border/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-foreground">No Preview Available</h3>
          <p className="text-sm text-muted-foreground">Generate a component to see the live preview</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`bg-card/50 backdrop-blur-xl flex flex-col border-l border-border/50 ${
        isFullscreen ? "fixed inset-0 z-50" : "w-96"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-violet-500/5 to-emerald-500/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-foreground">Live Preview</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPreview}
              disabled={isRefreshing}
              className="border-border/50 hover:bg-muted/50 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="border-border/50 hover:bg-muted/50"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Viewport Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant={viewportSize === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewportSize("mobile")}
            className={
              viewportSize === "mobile"
                ? "bg-gradient-to-r from-violet-500 to-emerald-500 text-white border-0"
                : "border-border/50 hover:bg-muted/50"
            }
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant={viewportSize === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewportSize("tablet")}
            className={
              viewportSize === "tablet"
                ? "bg-gradient-to-r from-violet-500 to-emerald-500 text-white border-0"
                : "border-border/50 hover:bg-muted/50"
            }
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewportSize === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewportSize("desktop")}
            className={
              viewportSize === "desktop"
                ? "bg-gradient-to-r from-violet-500 to-emerald-500 text-white border-0"
                : "border-border/50 hover:bg-muted/50"
            }
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>

        {/* Viewport Info */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="bg-violet-500/10 text-violet-600 border-violet-500/20">
            {viewportSize === "mobile" ? "375px" : viewportSize === "tablet" ? "768px" : "100%"}
          </Badge>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Responsive
          </Badge>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-6 bg-gradient-to-br from-muted/20 to-muted/40">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentComponent.id}-${viewportSize}`}
            variants={previewVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="h-full flex items-center justify-center"
          >
            <Card
              className="bg-background/80 backdrop-blur-sm rounded-xl shadow-2xl border-border/50 overflow-hidden transition-all duration-500 ease-out"
              style={{
                width: getViewportWidth(),
                height: getViewportHeight(),
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0 rounded-xl"
                title="Component Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
