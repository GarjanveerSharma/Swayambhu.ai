// In-memory fake database. Page refresh pe reset ho jata hai.
import chats from './chats.json'
import documents from './documents.json'
import files from './files.json'
import system from './system.json'
import network from './network.json'
import type { Chat } from '../types/chat'
import type { Document } from '../types/document'
import type { GeneratedFile } from '../types/file'
import type { SystemStatus } from '../types/system'
import type { AuditLog } from '../types/audit'
import type { Connection } from '../types/network'

export const db = {
  chats: structuredClone(chats) as Chat[],
  documents: structuredClone(documents) as Document[],
  files: structuredClone(files) as GeneratedFile[],
  system: structuredClone(system) as SystemStatus,
  connections: network.connections as Connection[],
  audit: [
    { id: 'a1', time: '2026-09-15T10:20:00Z', query: 'Pump P-101 ki servicing kab karni hai?', model: 'qwen3:14b', tools: ['search_kb'] },
    { id: 'a2', time: '2026-09-15T10:21:00Z', query: 'Iski Excel checklist bana do', model: 'qwen3:14b', tools: ['search_kb', 'make_xlsx'], file: 'p101_service_checklist.xlsx' },
    { id: 'a3', time: '2026-09-14T16:05:00Z', query: 'Is drawing ka BOM nikalo', model: 'qwen2.5vl:7b', tools: ['ocr_document'] },
  ] as AuditLog[],
}

export const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
