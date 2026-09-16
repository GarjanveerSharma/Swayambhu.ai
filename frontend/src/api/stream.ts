import { API_URL, USE_MOCKS } from '../constants/config'
import type { StreamEvent } from '../types/stream'
import type { ChatMode, Message } from '../types/chat'
import { parseStreamEvent } from '../utils/parseStreamEvent'
import { streamMock } from '../mocks/streamMock'
import { db } from '../mocks/db'
import { uid } from '../utils/id'

export interface StreamChatArgs {
  chatId: string | null
  message: string
  mode: ChatMode
  attachments: { id: string; name: string }[]
  useKnowledge: boolean
  signal: AbortSignal
  onEvent: (e: StreamEvent) => void
}

/**
 * POST /api/chat  → text/event-stream
 * Har line: data: {"type": "...", ...}
 */
export async function streamChat(args: StreamChatArgs) {
  if (USE_MOCKS) return streamMockAndSave(args)

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: args.chatId,
      message: args.message,
      mode: args.mode,
      attachment_ids: args.attachments.map((a) => a.id),
      use_knowledge: args.useKnowledge,
    }),
    signal: args.signal,
  })
  if (!res.ok || !res.body) throw new Error(`Chat request failed (${res.status})`)

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const event = parseStreamEvent(line)
      if (event) args.onEvent(event)
    }
  }
}

// Mock mode me messages ko fake db me bhi save karte hain, taaki history kaam kare
async function streamMockAndSave(args: StreamChatArgs) {
  let chatId = args.chatId
  const assistant: Message = { id: uid(), role: 'assistant', content: '', createdAt: new Date().toISOString(), steps: [], sources: [], files: [] }
  const save = () => {
    const chat = db.chats.find((c) => c.id === chatId)
    if (!chat) return
    chat.messages = [
      ...(chat.messages ?? []),
      { id: uid(), role: 'user', content: args.message, createdAt: new Date().toISOString(), attachments: args.attachments },
      assistant,
    ]
    chat.updatedAt = new Date().toISOString()
  }
  try {
    await streamMock({
      ...args,
      onEvent: (e) => {
        if (e.type === 'meta') chatId = e.chatId
        if (e.type === 'model') assistant.model = { name: e.name, reason: e.reason }
        if (e.type === 'token') assistant.content += e.text
        if (e.type === 'source') assistant.sources!.push(e.source)
        if (e.type === 'file') assistant.files!.push(e.file)
        if (e.type === 'step') {
          const s = assistant.steps!.find((x) => x.id === e.id)
          if (s) s.status = e.status
          else assistant.steps!.push({ id: e.id, text: e.text, status: e.status })
        }
        if (e.type === 'done') { assistant.durationMs = e.durationMs; save() }
        args.onEvent(e)
      },
    })
  } finally {
    if (args.signal.aborted) save()
  }
}
