import { useState } from 'react'
import type { Source } from '../../../types/stream'

export default function SourceItem({ source, index }: { source: Source; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="text-xs">
      <button className="text-accent hover:underline" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        [{index}] {source.file}, page {source.page}
      </button>
      {open && <blockquote className="mt-1 border-l-2 border-line pl-2 text-muted">{source.text}</blockquote>}
    </li>
  )
}
