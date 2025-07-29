"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Send, ImageIcon, Loader2, User, Bot } from "lucide-react"

export function ChatPanel() {
  const [input, setInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const { currentSession, addMessage, addComponent, isGenerating, setIsGenerating } = useAppStore()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [currentSession?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage = input.trim()
    setInput("")
    setImageFile(null)

    // Add user message
    addMessage({ role: "user", content: userMessage })
    setIsGenerating(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...(currentSession?.messages || []), { role: "user", content: userMessage }],
          sessionId: currentSession?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      const data = await response.json()

      // Add AI response
      addMessage({ role: "assistant", content: data.message })

      // Add generated component if present
      if (data.component) {
        addComponent({
          name: data.component.name,
          tsx: data.component.tsx,
          css: data.component.css,
        })
      }
    } catch (error) {
      console.error("Chat error:", error)
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
    }
  }

  return (
    <div className="w-96 bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border bg-background">
        <h2 className="font-semibold text-foreground">Chat</h2>
        <p className="text-sm text-muted-foreground mt-1">Describe the component you want to create</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {currentSession?.messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start a conversation</p>
              <p className="text-xs mt-1">Ask me to create any React component you need</p>
            </div>
          )}

          {currentSession?.messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}
                >
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`rounded-lg px-3 py-2 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-card text-muted-foreground flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-card rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="typing-indicator">Generating...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleSubmit} className="space-y-3">
          {imageFile && (
            <div className="flex items-center gap-2 p-2 bg-card rounded-lg">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground flex-1 truncate">{imageFile.name}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setImageFile(null)}>
                ×
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your component..."
              disabled={isGenerating}
              className="flex-1 bg-card text-foreground"
            />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button type="submit" disabled={!input.trim() || isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
