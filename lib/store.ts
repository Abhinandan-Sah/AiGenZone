import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface GeneratedComponent {
  id: string
  name: string
  tsx: string
  css: string
  timestamp: Date
}

export interface Session {
  id: string
  name: string
  messages: ChatMessage[]
  components: GeneratedComponent[]
  currentComponent: GeneratedComponent | null
  createdAt: Date
  updatedAt: Date
}

interface AppState {
  // Current session
  currentSession: Session | null
  sessions: Session[]

  // UI state
  isGenerating: boolean
  activeTab: "tsx" | "css" | "preview"
  sidebarOpen: boolean

  // Actions
  createSession: (name?: string) => void
  loadSession: (sessionId: string) => void
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  addComponent: (component: Omit<GeneratedComponent, "id" | "timestamp">) => void
  updateComponent: (componentId: string, updates: Partial<GeneratedComponent>) => void
  setCurrentComponent: (component: GeneratedComponent | null) => void
  setIsGenerating: (generating: boolean) => void
  setActiveTab: (tab: "tsx" | "css" | "preview") => void
  setSidebarOpen: (open: boolean) => void
  deleteSession: (sessionId: string) => void
  renameSession: (sessionId: string, name: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      isGenerating: false,
      activeTab: "preview",
      sidebarOpen: true,

      createSession: (name = "New Session") => {
        const newSession: Session = {
          id: crypto.randomUUID(),
          name,
          messages: [],
          components: [],
          currentComponent: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSession: newSession,
        }))
      },

      loadSession: (sessionId: string) => {
        const session = get().sessions.find((s) => s.id === sessionId)
        if (session) {
          set({ currentSession: session })
        }
      },

      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        }

        set((state) => {
          if (!state.currentSession) return state

          const updatedSession = {
            ...state.currentSession,
            messages: [...state.currentSession.messages, newMessage],
            updatedAt: new Date(),
          }

          return {
            currentSession: updatedSession,
            sessions: state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
          }
        })
      },

      addComponent: (component) => {
        const newComponent: GeneratedComponent = {
          ...component,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        }

        set((state) => {
          if (!state.currentSession) return state

          const updatedSession = {
            ...state.currentSession,
            components: [...state.currentSession.components, newComponent],
            currentComponent: newComponent,
            updatedAt: new Date(),
          }

          return {
            currentSession: updatedSession,
            sessions: state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
          }
        })
      },

      updateComponent: (componentId, updates) => {
        set((state) => {
          if (!state.currentSession) return state

          const updatedSession = {
            ...state.currentSession,
            components: state.currentSession.components.map((c) => (c.id === componentId ? { ...c, ...updates } : c)),
            currentComponent:
              state.currentSession.currentComponent?.id === componentId
                ? { ...state.currentSession.currentComponent, ...updates }
                : state.currentSession.currentComponent,
            updatedAt: new Date(),
          }

          return {
            currentSession: updatedSession,
            sessions: state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
          }
        })
      },

      setCurrentComponent: (component) => {
        set((state) => {
          if (!state.currentSession) return state

          const updatedSession = {
            ...state.currentSession,
            currentComponent: component,
            updatedAt: new Date(),
          }

          return {
            currentSession: updatedSession,
            sessions: state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
          }
        })
      },

      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      deleteSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
          currentSession: state.currentSession?.id === sessionId ? null : state.currentSession,
        }))
      },

      renameSession: (sessionId, name) => {
        set((state) => {
          const updatedSessions = state.sessions.map((s) =>
            s.id === sessionId ? { ...s, name, updatedAt: new Date() } : s,
          )

          return {
            sessions: updatedSessions,
            currentSession:
              state.currentSession?.id === sessionId
                ? { ...state.currentSession, name, updatedAt: new Date() }
                : state.currentSession,
          }
        })
      },
    }),
    {
      name: "ai-frontend-generator-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        currentSession: state.currentSession,
      }),
    },
  ),
)
