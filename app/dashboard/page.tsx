"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatPanel } from "@/components/chat-panel"
import { CodeEditor } from "@/components/code-editor"
import { PreviewPanel } from "@/components/preview-panel"
import { useAppStore } from "@/lib/store"
import { useEffect } from "react"

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

  useEffect(() => {
    if (!currentSession) {
      createSession("Welcome Session")
    }
  }, [currentSession, createSession])

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
