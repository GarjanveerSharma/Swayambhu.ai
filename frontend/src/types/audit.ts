export interface AuditLog {
  id: string
  time: string
  query: string
  model: string
  tools: string[]
  file?: string
}
