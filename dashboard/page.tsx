"use client"

import { useAuth } from "@/components/auth-provider"
import { useAppStore } from "@/lib/store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatPanel } from "@/components/chat-panel"
import { CodeEditor } from "@/components/code-editor"
import { PreviewPanel } from "@/components/preview-panel"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { currentSession, createSession } = useAppStore()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && !currentSession) {
      createSession("Welcome Session")
    }
  }, [user, currentSession, createSession])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="flex h-full">
        <ChatPanel />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <CodeEditor />
            <PreviewPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
