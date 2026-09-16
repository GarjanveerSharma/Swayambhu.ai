import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { streamChat } from '../api/stream'
import { useChatStore } from '../store/chatStore'
import { useAttachmentStore } from '../store/attachmentStore'
import { useUiStore } from '../store/uiStore'
import type { Message } from '../types/chat'
import type { StreamEvent } from '../types/stream'
import { uid } from '../utils/id'
import { ROUTES } from '../constants/routes'

export function useChatStream() {
  const abortRef = useRef<AbortController | null>(null)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useUiStore((s) => s.toast)

  const run = async (text: string, attachments: { id: string; name: string }[]) => {
    const store = useChatStore.getState()
    const assistantId = uid()
    store.addMessage({ id: uid(), role: 'user', content: text, attachments, createdAt: new Date().toISOString() })
    store.addMessage({ id: assistantId, role: 'assistant', content: '', createdAt: new Date().toISOString(), steps: [], sources: [], files: [] })
    store.setStreaming(true)

    const update = (fn: (m: Message) => Message) => useChatStore.getState().updateMessage(assistantId, fn)
    const controller = new AbortController()
    abortRef.current = controller
    let newChatId: string | null = null

    const onEvent = (e: StreamEvent) => {
      switch (e.type) {
        case 'meta':
          if (!store.activeChatId) {
            newChatId = e.chatId
            useChatStore.setState({ activeChatId: e.chatId })
          }
          break
        case 'model':
          update((m) => ({ ...m, model: { name: e.name, reason: e.reason } }))
          break
        case 'step':
          update((m) => {
            const steps = m.steps ?? []
            const exists = steps.some((s) => s.id === e.id)
            return {
              ...m,
              steps: exists
                ? steps.map((s) => (s.id === e.id ? { ...s, status: e.status } : s))
                : [...steps, { id: e.id, text: e.text, status: e.status }],
            }
          })
          break
        case 'token':
          update((m) => ({ ...m, content: m.content + e.text }))
          break
        case 'source':
          update((m) => ({ ...m, sources: [...(m.sources ?? []), e.source] }))
          break
        case 'file':
          update((m) => ({ ...m, files: [...(m.files ?? []), e.file] }))
          qc.invalidateQueries({ queryKey: ['files'] })
          break
        case 'done':
          update((m) => ({ ...m, durationMs: e.durationMs }))
          break
        case 'error':
          update((m) => ({ ...m, error: e.message }))
          break
      }
    }

    try {
      await streamChat({ chatId: store.activeChatId, message: text, mode: store.mode, attachments, useKnowledge: store.useKnowledge, signal: controller.signal, onEvent })
    } catch (err) {
      if (!controller.signal.aborted) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        update((m) => ({ ...m, error: msg }))
        toast(msg, 'error')
      }
    } finally {
      useChatStore.getState().setStreaming(false)
      abortRef.current = null
      qc.invalidateQueries({ queryKey: ['chats'] })
      qc.invalidateQueries({ queryKey: ['chat'] })
      qc.invalidateQueries({ queryKey: ['audit'] })
      if (newChatId) navigate(ROUTES.chatById(newChatId), { replace: true })
    }
  }

  const send = (text: string) => {
    const { items, clear } = useAttachmentStore.getState()
    const ready = items.filter((i) => !i.uploading).map(({ id, name }) => ({ id, name }))
    clear()
    return run(text, ready)
  }

  const stop = () => abortRef.current?.abort()

  // Last user message ko dobara bhejo
  const regenerate = () => {
    const { messages, removeMessagesFrom } = useChatStore.getState()
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUser) return
    removeMessagesFrom(lastUser.id)
    return run(lastUser.content, lastUser.attachments ?? [])
  }

  return { send, stop, regenerate }
}
