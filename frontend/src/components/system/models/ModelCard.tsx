import type { ModelInfo } from '../../../types/system'
import Badge from '../../ui/Badge'

const ROLE_LABEL: Record<ModelInfo['role'], string> = {
  fast: 'Fast inference',
  reasoning: 'Reasoning & code',
  vision: 'Vision & OCR',
  embedding: 'Vector search',
}

export default function ModelCard({ model }: { model: ModelInfo }) {
  const isLoaded = model.status === 'loaded'
  return (
    <div className="flex flex-col justify-between rounded-xl border border-line bg-panel p-4 transition-colors duration-150 hover:border-muted">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[13px] font-semibold tracking-tight text-text truncate">
          {model.name}
        </span>
        <Badge tone={isLoaded ? 'ok' : 'neutral'}>
          {model.status}
        </Badge>
      </div>
      <div className="mt-3 flex flex-col gap-0.5">
        <span className="text-xs text-muted">{ROLE_LABEL[model.role]}</span>
        <span className="font-mono text-[11px] text-muted tabular-nums">{model.size}</span>
      </div>
    </div>
  )
}
