"use client"

import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ChatPanel } from "@/components/chat/ChatPanel"
import { CodeEditor } from "@/components/editor/CodeEditor"
import { PreviewPanel } from "@/components/preview/PreviewPanel"
import { useAppStore } from "@/store/useAppStore"

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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
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
