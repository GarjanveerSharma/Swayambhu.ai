import type { GeneratedFile } from './file'

export interface Source {
  docId: string
  file: string
  page: number
  text: string
}

export interface AgentStep {
  id: string
  text: string
  status: 'running' | 'done' | 'failed'
}

export type StreamEvent =
  | { type: 'meta'; chatId: string; messageId: string }
  | { type: 'model'; name: string; reason: string }
  | { type: 'step'; id: string; text: string; status: AgentStep['status'] }
  | { type: 'token'; text: string }
  | { type: 'source'; source: Source }
  | { type: 'file'; file: GeneratedFile }
  | { type: 'done'; durationMs: number }
  | { type: 'error'; message: string }
