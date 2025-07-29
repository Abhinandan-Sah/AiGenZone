"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageSquare, MoreVertical, Trash2, Edit2, Calendar } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function SessionSidebar() {
  const { sessions, currentSession, sidebarOpen, loadSession, deleteSession, renameSession } = useAppStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const handleRename = (sessionId: string, currentName: string) => {
    setEditingId(sessionId)
    setEditName(currentName)
  }

  const saveRename = (sessionId: string) => {
    if (editName.trim()) {
      renameSession(sessionId, editName.trim())
    }
    setEditingId(null)
    setEditName("")
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  if (!sidebarOpen) return null

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Sessions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sessions yet</p>
            <p className="text-xs mt-1">Create a new session to get started</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group relative rounded-lg p-3 cursor-pointer transition-colors",
                  currentSession?.id === session.id ? "bg-accent border border-accent-foreground/20" : "hover:bg-accent/50",
                )}
                onClick={() => loadSession(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingId === session.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => saveRename(session.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(session.id)
                          if (e.key === "Escape") {
                            setEditingId(null)
                            setEditName("")
                          }
                        }}
                        className="h-6 text-sm font-medium"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-sm font-medium text-foreground truncate">{session.name}</h3>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatDate(session.updatedAt)}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{session.messages.length} messages</span>
                      <span>{session.components.length} components</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRename(session.id, session.name)
                        }}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(session.id)
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
