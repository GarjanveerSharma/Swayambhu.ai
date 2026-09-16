import type { Source, AgentStep } from './stream'
import type { GeneratedFile } from './file'

export type ChatMode = 'auto' | 'fast' | 'smart'

export interface ModelInfoLite {
  name: string
  reason: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  attachments?: { id: string; name: string }[]
  model?: ModelInfoLite
  durationMs?: number
  steps?: AgentStep[]
  sources?: Source[]
  files?: GeneratedFile[]
  error?: string
}

export interface Chat {
  id: string
  title: string
  updatedAt: string
  messages?: Message[]
}
