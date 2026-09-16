import type { ModelInfo } from '../../../types/system'
import Badge from '../../ui/Badge'

const ROLE_LABEL: Record<ModelInfo['role'], string> = {
  fast: 'Fast answers',
  reasoning: 'Reasoning + agent',
  vision: 'Images + scans',
  embedding: 'Document search',
}

export default function ModelCard({ model }: { model: ModelInfo }) {
  return (
    <div className="rounded-md border border-line bg-panel p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono font-medium">{model.name}</span>
        <Badge tone={model.status === 'loaded' ? 'ok' : 'neutral'}>{model.status}</Badge>
      </div>
      <div className="mt-1 text-muted">{ROLE_LABEL[model.role]}</div>
      <div className="text-xs text-muted">{model.size}</div>
    </div>
  )
}
