import type { StreamEvent } from '../types/stream'

// Backend SSE line: "data: {...json...}"
export function parseStreamEvent(line: string): StreamEvent | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith('data:')) return null
  try {
    return JSON.parse(trimmed.slice(5).trim()) as StreamEvent
  } catch {
    return null
  }
}
