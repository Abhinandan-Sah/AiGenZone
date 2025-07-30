"use client"

import { useAppStore } from "@/lib/store"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Smartphone, Tablet, Monitor, Eye, Maximize2, Minimize2, Bug, Clock } from "lucide-react"
import { toast } from "sonner"

const containerVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
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
      ease: "easeOut" as const,
    },
  },
}

export function PreviewPanel() {
  const { currentSession } = useAppStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [viewportSize, setViewportSize] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [lastRenderTime, setLastRenderTime] = useState<Date | null>(null)

  const currentComponent = currentSession?.currentComponent

  const refreshPreview = () => {
    setIsRefreshing(true)
    setLastRenderTime(new Date())
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

  // Enhanced component processing with better error handling
  const processComponentCode = (tsx: string) => {
    console.log('Processing component code:', tsx)
    
    // Clean up the code
    let cleanCode = tsx
      .replace(/^export\s+(default\s+)?/gm, '') // Remove export statements
      .replace(/^import.*?;?\n/gm, '') // Remove import statements
      .trim()

    // If it's wrapped in code blocks, extract it
    const codeBlockMatch = cleanCode.match(/```(?:tsx|typescript|javascript)?\n?([\s\S]*?)```/)
    if (codeBlockMatch) {
      cleanCode = codeBlockMatch[1].trim()
    }

    // Ensure we have a proper component function
    if (!cleanCode.includes('function') && !cleanCode.includes('const') && !cleanCode.includes('=>')) {
      cleanCode = `
        function GeneratedComponent() {
          return (
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="text-center text-gray-500">
                <div className="text-lg mb-2">Component Preview</div>
                <div className="text-sm">Generated component will appear here</div>
              </div>
            </div>
          );
        }
      `
    }

    return cleanCode
  }

  useEffect(() => {
    if (currentComponent && iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document

      if (doc) {
        const processedCode = processComponentCode(currentComponent.tsx)
        
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Component Preview</title>
            <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                min-height: 100vh;
                overflow-x: auto;
              }
              .preview-container {
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                border: 1px solid rgba(0, 0, 0, 0.05);
                min-height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
              }
              
              /* Custom CSS from the component */
              ${currentComponent.css || ''}
              
              /* Ensure components are responsive and look good */
              * {
                box-sizing: border-box;
              }
              
              /* Enhanced default styling */
              .btn, button {
                cursor: pointer;
                transition: all 0.2s ease;
              }
              
              .card {
                border-radius: 8px;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
              }

              /* Debug styles */
              .debug-info {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px;
                border-radius: 4px;
                font-size: 10px;
                font-family: monospace;
                z-index: 1000;
                max-width: 200px;
                word-break: break-word;
                display: ${debugMode ? 'block' : 'none'};
              }
            </style>
            <script>
              // Enhanced Tailwind CSS configuration
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"},
                      violet: {"50":"#f5f3ff","100":"#ede9fe","200":"#ddd6fe","300":"#c4b5fd","400":"#a78bfa","500":"#8b5cf6","600":"#7c3aed","700":"#6d28d9","800":"#5b21b6","900":"#4c1d95","950":"#2e1065"},
                      emerald: {"50":"#ecfdf5","100":"#d1fae5","200":"#a7f3d0","300":"#6ee7b7","400":"#34d399","500":"#10b981","600":"#059669","700":"#047857","800":"#065f46","900":"#064e3b","950":"#022c22"}
                    },
                    fontFamily: {
                      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
                    }
                  }
                }
              }

              // Global error handler
              window.onerror = function(msg, url, lineNo, columnNo, error) {
                console.error('Global error:', { msg, url, lineNo, columnNo, error });
                return false;
              };
            </script>
          </head>
          <body>
            <div id="root"></div>
            <div id="debug" class="debug-info" style="display: none;"></div>
            
            <script type="text/babel" data-type="module">
              const { useState, useEffect, useRef, Fragment, useMemo, useCallback } = React;
              
              // Enhanced Lucide icons availability
              const icons = LucideReact;
              const { 
                Heart, Star, ChevronDown, ChevronRight, ChevronLeft, ChevronUp,
                User, Mail, Phone, MapPin, Calendar, Clock, Search, Menu, X,
                Plus, Minus, Edit, Trash2, Settings, Home, Bell, MessageCircle,
                Share, Download, Upload, Eye, EyeOff, Lock, Unlock, Check,
                AlertCircle, Info, ShoppingCart, CreditCard, Package, Truck,
                Gift, Tag, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
                Sun, Moon, Cloud, CloudRain, Zap, Wifi, WifiOff, Camera, Image,
                Video, Mic, MicOff, Speaker, Headphones, FileText, File, Folder,
                FolderOpen, Link, ExternalLink, Copy, Cut, Paste, Undo, Redo,
                Save, Print, Archive, Database, Server, Code, Terminal, Cpu,
                HardDrive, Smartphone, Tablet, Monitor, Laptop, Watch, Gamepad2,
                Car, Plane, Train, Ship, Bike, Coffee, Pizza, Utensils, Wine,
                Beer, IceCream, Shirt, Gem, Crown, Award, Medal, Book, BookOpen,
                GraduationCap, School, Library, Hospital, Pill, Stethoscope,
                Activity, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, MoreHorizontal,
                MoreVertical, Filter, Sort, Refresh, Loader, Spinner
              } = icons;
              
              // Debug function
              function debug(message) {
                console.log('Preview Debug:', message);
                const debugEl = document.getElementById('debug');
                if (debugEl) {
                  debugEl.textContent = JSON.stringify(message, null, 2);
                  debugEl.style.display = 'block';
                }
              }

              try {
                // Component code processing
                let componentCode = \`${processedCode}\`;
                debug('Component code length: ' + componentCode.length);
                
                // Execute the component code with better error handling
                const executeComponent = () => {
                  try {
                    // Create a wrapper function to execute the code safely
                    const wrappedCode = \`
                      (() => {
                        \${componentCode}
                        return typeof GeneratedComponent !== 'undefined' ? GeneratedComponent : null;
                      })()
                    \`;
                    
                    const ComponentFunction = eval(wrappedCode);
                    
                    if (ComponentFunction && typeof ComponentFunction === 'function') {
                      debug('Component function found successfully');
                      return ComponentFunction;
                    }
                    
                    // Fallback: try to find any component function
                    const functionMatches = componentCode.match(/(?:function|const)\\s+([A-Z][a-zA-Z0-9_]*)/g);
                    if (functionMatches) {
                      debug('Found functions: ' + functionMatches.join(', '));
                      for (const match of functionMatches) {
                        const nameMatch = match.match(/(?:function|const)\\s+([A-Z][a-zA-Z0-9_]*)/);
                        if (nameMatch) {
                          try {
                            const componentName = nameMatch[1];
                            eval(componentCode);
                            const Component = eval(componentName);
                            if (typeof Component === 'function') {
                              debug('Using component: ' + componentName);
                              return Component;
                            }
                          } catch (e) {
                            debug('Failed to use component ' + nameMatch[1] + ': ' + e.message);
                          }
                        }
                      }
                    }
                    
                    throw new Error('No valid React component found');
                  } catch (error) {
                    debug('Execute error: ' + error.message);
                    throw error;
                  }
                };

                const ComponentToRender = executeComponent();
                
                const App = () => {
                  const [renderKey, setRenderKey] = useState(0);
                  
                  const refreshComponent = useCallback(() => {
                    setRenderKey(prev => prev + 1);
                  }, []);
                  
                  useEffect(() => {
                    // Auto-refresh every 5 seconds in case of updates
                    const interval = setInterval(refreshComponent, 5000);
                    return () => clearInterval(interval);
                  }, [refreshComponent]);
                  
                  return (
                    <div className="preview-container">
                      <div key={renderKey} className="w-full h-full">
                        {React.createElement(ComponentToRender, {
                          key: renderKey,
                          // Pass common props that components might expect
                          className: "w-full h-full"
                        })}
                      </div>
                    </div>
                  );
                };
                
                debug('Rendering App component');
                ReactDOM.render(<App />, document.getElementById('root'));
                
              } catch (error) {
                debug('Render error: ' + error.message);
                console.error('Component render error:', error);
                
                const ErrorComponent = () => (
                  <div className="preview-container">
                    <div className="text-center p-8 max-w-md">
                      <div className="text-red-500 text-4xl mb-4">⚠️</div>
                      <div className="text-lg font-semibold text-red-600 mb-3">Component Error</div>
                      <div className="text-sm text-gray-600 mb-4">
                        There was an error rendering this component. This might be due to:
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg font-mono text-left mb-4">
                        {error.message}
                      </div>
                      <div className="text-xs text-gray-400">
                        • Missing component definition<br/>
                        • Syntax errors in TSX<br/>
                        • Missing React hooks<br/>
                        • Invalid JSX structure
                      </div>
                    </div>
                  </div>
                );
                
                ReactDOM.render(<ErrorComponent />, document.getElementById('root'));
              }
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
              onClick={() => setDebugMode(!debugMode)}
              className={`border-border/50 hover:bg-muted/50 ${debugMode ? 'bg-orange-500/10 text-orange-600' : ''}`}
            >
              <Bug className="h-4 w-4" />
            </Button>
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
          {debugMode && (
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
              <Bug className="w-3 h-3 mr-1" />
              Debug
            </Badge>
          )}
          {lastRenderTime && (
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              <Clock className="w-3 h-3 mr-1" />
              {lastRenderTime.toLocaleTimeString()}
            </Badge>
          )}
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
