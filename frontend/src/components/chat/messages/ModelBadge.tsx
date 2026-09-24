import type { ModelInfoLite } from '../../../types/chat'
import { formatDuration } from '../../../utils/formatDuration'

export default function ModelBadge({ model, durationMs }: { model: ModelInfoLite; durationMs?: number }) {
  return (
    <div
      className="flex items-center gap-1.5 text-[12px] text-muted"
      title={model.reason}
    >
      <span className="font-mono">{model.name}</span>
      {durationMs !== undefined && (
        <span className="text-muted/60">· {formatDuration(durationMs)}</span>
      )}
    </div>
  )
}
