"use client"

import { useAppStore } from "@/lib/store"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Smartphone, Tablet, Monitor, Eye } from "lucide-react"

export function PreviewPanel() {
  const { currentSession } = useAppStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [viewportSize, setViewportSize] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const currentComponent = currentSession?.currentComponent

  const refreshPreview = () => {
    setIsRefreshing(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
    setTimeout(() => setIsRefreshing(false), 500)
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
                background: #f9fafb;
              }
              .preview-container {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
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
      <div className="w-96 bg-background flex items-center justify-center border-l border-border">
        <div className="text-center text-muted-foreground">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2 text-foreground">No Preview Available</h3>
          <p className="text-sm">Generate a component to see the live preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-96 bg-background flex flex-col border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Live Preview</h2>
          <Button variant="outline" size="sm" onClick={refreshPreview} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant={viewportSize === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewportSize("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant={viewportSize === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewportSize("tablet")}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewportSize === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewportSize("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 bg-background">
        <div
          className="mx-auto bg-card rounded-lg shadow-sm border border-border overflow-hidden"
          style={{
            width: getViewportWidth(),
            height: "100%",
            minHeight: "400px",
            transition: "width 0.3s ease",
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Component Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}
