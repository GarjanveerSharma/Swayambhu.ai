// Fake streaming: backend jaisa hi event order bhejta hai.
import type { StreamEvent } from '../types/stream'
import type { ChatMode } from '../types/chat'
import { db, delay } from './db'
import { uid } from '../utils/id'

interface Args {
  chatId: string | null
  message: string
  mode: ChatMode
  attachments: { id: string; name: string }[]
  useKnowledge: boolean
  signal: AbortSignal
  onEvent: (e: StreamEvent) => void
}

export async function streamMock({ chatId, message, mode, attachments, useKnowledge, signal, onEvent }: Args) {
  const start = Date.now()
  const wantsFile = /excel|xlsx|report|word|docx|pdf|ppt|bana/i.test(message)
  const hasImage = attachments.some((a) => /\.(png|jpe?g|tiff?)$/i.test(a.name))

  const id = chatId ?? uid()
  if (!chatId) {
    db.chats.unshift({ id, title: message.slice(0, 40), updatedAt: new Date().toISOString(), messages: [] })
  }
  onEvent({ type: 'meta', chatId: id, messageId: uid() })

  let model = { name: 'qwen3:4b', reason: 'Simple query' }
  if (mode === 'smart') model = { name: 'qwen3:14b', reason: 'Smart mode selected' }
  if (mode === 'auto' && (wantsFile || message.length > 60)) model = { name: 'qwen3:14b', reason: wantsFile ? 'File banani hai, agent mode' : 'Complex query' }
  if (hasImage) model = { name: 'qwen2.5vl:7b', reason: 'Image/scan attached' }
  await delay(300)
  onEvent({ type: 'model', ...model })

  const steps: string[] = []
  if (hasImage) steps.push('Scan se text nikal raha hai (OCR)')
  if (useKnowledge) steps.push('Company documents me search')
  if (wantsFile) steps.push('File generate ho rahi hai')

  for (const text of steps) {
    if (signal.aborted) return
    const sid = uid()
    onEvent({ type: 'step', id: sid, text, status: 'running' })
    await delay(700)
    onEvent({ type: 'step', id: sid, text, status: 'done' })
  }

  const answer =
    `Ye ek **mock jawab** hai (backend abhi connect nahi hai).\n\n` +
    `Aapka sawaal: _${message}_\n\n` +
    `- Model: \`${model.name}\`\n- Mode: ${mode}\n- Knowledge base: ${useKnowledge ? 'on' : 'off'}\n\n` +
    `Jab backend ready ho jaye, \`.env\` me \`VITE_USE_MOCKS=false\` kar dena.`

  for (const word of answer.split(/(\s+)/)) {
    if (signal.aborted) return
    onEvent({ type: 'token', text: word })
    await delay(25)
  }

  if (useKnowledge) {
    onEvent({
      type: 'source',
      source: { docId: 'd1', file: 'pump_maintenance_manual.pdf', page: 12, text: 'Centrifugal pump P-101 shall be serviced every 500 running hours or quarterly, whichever is earlier.' },
    })
  }

  if (wantsFile) {
    const file = { id: uid(), name: 'generated_checklist.xlsx', type: 'xlsx', size: 17400, chatId: id, createdAt: new Date().toISOString() }
    db.files.unshift(file)
    onEvent({ type: 'file', file })
  }

  db.audit.unshift({
    id: uid(), time: new Date().toISOString(), query: message, model: model.name,
    tools: [hasImage && 'ocr_document', useKnowledge && 'search_kb', wantsFile && 'make_xlsx'].filter(Boolean) as string[],
  })

  onEvent({ type: 'done', durationMs: Date.now() - start })
}
