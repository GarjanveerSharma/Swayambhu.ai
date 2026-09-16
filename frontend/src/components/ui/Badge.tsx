import type { ReactNode } from 'react'

type Tone = 'neutral' | 'ok' | 'warn' | 'err' | 'accent'
const tones: Record<Tone, string> = {
  neutral: 'border-line text-muted',
  ok: 'border-ok text-ok',
  warn: 'border-warn text-warn',
  err: 'border-err text-err',
  accent: 'border-accent text-accent',
}

export default function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs ${tones[tone]}`}>{children}</span>
}
