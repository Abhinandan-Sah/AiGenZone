"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatPanel } from "@/components/chat-panel"
import { CodeEditor } from "@/components/code-editor"
import { PreviewPanel } from "@/components/preview-panel"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function DashboardPage() {
  const { createSession, currentSession } = useAppStore()
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (!currentSession && user) {
      createSession("Welcome Session")
    }
  }, [currentSession, createSession, user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <DashboardLayout>
      <motion.div
        className="flex-1 flex overflow-hidden bg-background"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ChatPanel />
        <CodeEditor />
        <PreviewPanel />
      </motion.div>
    </DashboardLayout>
  )
}
