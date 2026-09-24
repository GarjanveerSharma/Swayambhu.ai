import type { ReactNode } from 'react'

type Tone = 'neutral' | 'ok' | 'warn' | 'err' | 'accent'

const dotColor: Record<Tone, string> = {
  neutral: 'bg-muted',
  ok:      'bg-ok',
  warn:    'bg-warn',
  err:     'bg-err',
  accent:  'bg-accent',
}

const textColor: Record<Tone, string> = {
  neutral: 'text-muted',
  ok:      'text-ok',
  warn:    'text-warn',
  err:     'text-err',
  accent:  'text-text',
}

export default function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${textColor[tone]}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 ${dotColor[tone]}`} aria-hidden />
      {children}
    </span>
  )
}
