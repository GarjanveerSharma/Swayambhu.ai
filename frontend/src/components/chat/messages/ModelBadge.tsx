import { Cpu } from 'lucide-react'
import type { ModelInfoLite } from '../../../types/chat'
import { formatDuration } from '../../../utils/formatDuration'

export default function ModelBadge({ model, durationMs }: { model: ModelInfoLite; durationMs?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
      <span className="flex items-center gap-1 rounded border border-accent px-1.5 py-0.5 text-accent">
        <Cpu size={12} /> {model.name}
      </span>
      <span>{model.reason}</span>
      {durationMs !== undefined && <span>· {formatDuration(durationMs)}</span>}
    </div>
  )
}
