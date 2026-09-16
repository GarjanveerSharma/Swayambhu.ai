export type DocStatus = 'processing' | 'ready' | 'failed'

export interface Document {
  id: string
  name: string
  type: string
  size: number
  pages: number | null
  uploadedAt: string
  status: DocStatus
  error?: string
}
