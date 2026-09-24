import type { ReactNode } from 'react'

export default function EmptyState({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line p-12 text-center">
      <p className="text-sm text-muted">{text}</p>
      {action}
    </div>
  )
}
