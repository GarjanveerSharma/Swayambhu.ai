import { useState } from 'react'
import type { Source } from '../../../types/stream'

export default function SourceItem({ source, index }: { source: Source; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <button
        className="inline-flex items-center gap-1 rounded-full border border-line bg-panel px-2.5 py-1 text-xs text-muted transition-colors duration-100 hover:border-accent/30 hover:text-text"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-semibold text-text">{index}</span>
        {source.file}
        {source.page && <span className="text-muted/60">· p.{source.page}</span>}
      </button>
      {open && (
        <blockquote className="mt-2 border-l-2 border-line pl-3 text-xs text-muted leading-relaxed">
          {source.text}
        </blockquote>
      )}
    </li>
  )
}
