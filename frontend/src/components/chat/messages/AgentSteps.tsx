import { useState } from 'react'
import { Check, ChevronDown, ChevronRight, X } from 'lucide-react'
import type { AgentStep } from '../../../types/stream'
import Spinner from '../../ui/Spinner'

export default function AgentSteps({
  steps,
  streaming,
}: {
  steps: AgentStep[]
  streaming?: boolean
}) {
  const [open, setOpen] = useState(false)
  const done = steps.filter((s) => s.status === 'done').length
  const allDone = done === steps.length

  return (
    <div className="text-[13px]">
      <button
        className="flex items-center gap-1.5 text-muted transition-colors duration-100 hover:text-text"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        {streaming && !allDone ? (
          <span className="flex items-center gap-1.5">
            <Spinner size={12} />
            Working…
          </span>
        ) : (
          <span>
            Completed {done} step{done !== 1 ? 's' : ''}
          </span>
        )}
      </button>

      {open && (
        <ul className="mt-2 flex flex-col gap-1.5 pl-5">
          {steps.map((s) => (
            <li key={s.id} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">
                {s.status === 'running' && <Spinner size={12} />}
                {s.status === 'done'    && <Check size={12} className="text-ok" />}
                {s.status === 'failed'  && <X    size={12} className="text-err" />}
              </span>
              <span className={`leading-snug ${s.status === 'running' ? 'text-text' : 'text-muted'}`}>
                {s.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
