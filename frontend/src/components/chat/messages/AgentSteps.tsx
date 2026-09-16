import { useState } from 'react'
import { Check, ChevronDown, ChevronRight, X } from 'lucide-react'
import type { AgentStep } from '../../../types/stream'
import Spinner from '../../ui/Spinner'

export default function AgentSteps({ steps }: { steps: AgentStep[] }) {
  const [open, setOpen] = useState(true)
  const done = steps.filter((s) => s.status === 'done').length
  return (
    <div className="rounded-md border border-line text-sm">
      <button className="flex w-full items-center gap-1 px-2 py-1.5 text-left text-muted" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Steps ({done}/{steps.length})
      </button>
      {open && (
        <ul className="flex flex-col gap-1 border-t border-line px-3 py-2">
          {steps.map((s) => (
            <li key={s.id} className="flex items-center gap-2">
              {s.status === 'running' && <Spinner size={14} />}
              {s.status === 'done' && <Check size={14} className="text-ok" />}
              {s.status === 'failed' && <X size={14} className="text-err" />}
              <span className={s.status === 'running' ? '' : 'text-muted'}>{s.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
