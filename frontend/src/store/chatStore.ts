import { create } from 'zustand'
import type { ChatMode, Message } from '../types/chat'

interface ChatState {
  activeChatId: string | null
  messages: Message[]
  isStreaming: boolean
  mode: ChatMode
  useKnowledge: boolean
  setActiveChat: (id: string | null, messages?: Message[]) => void
  addMessage: (m: Message) => void
  updateMessage: (id: string, fn: (m: Message) => Message) => void
  removeMessagesFrom: (id: string) => void
  setStreaming: (v: boolean) => void
  setMode: (m: ChatMode) => void
  setUseKnowledge: (v: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: null,
  messages: [],
  isStreaming: false,
  mode: 'auto',
  useKnowledge: true,
  setActiveChat: (id, messages = []) => set({ activeChatId: id, messages }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  updateMessage: (id, fn) => set((s) => ({ messages: s.messages.map((m) => (m.id === id ? fn(m) : m)) })),
  removeMessagesFrom: (id) =>
    set((s) => {
      const i = s.messages.findIndex((m) => m.id === id)
      return i === -1 ? s : { messages: s.messages.slice(0, i) }
    }),
  setStreaming: (v) => set({ isStreaming: v }),
  setMode: (mode) => set({ mode }),
  setUseKnowledge: (useKnowledge) => set({ useKnowledge }),
}))
