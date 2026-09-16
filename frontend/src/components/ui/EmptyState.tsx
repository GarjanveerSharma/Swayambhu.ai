import type { ReactNode } from 'react'

export default function EmptyState({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-line p-8 text-center text-sm text-muted">
      <p>{text}</p>
      {action}
    </div>
  )
}
