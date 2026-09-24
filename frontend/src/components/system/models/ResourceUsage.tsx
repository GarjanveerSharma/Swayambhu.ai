import type { ResourceUsage as R } from '../../../types/system'
import ProgressBar from '../../ui/ProgressBar'

function Row({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = (used / total) * 100
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-text">{label}</span>
        <span className="font-mono text-muted tabular-nums">
          {used} / {total} GB ({Math.round(pct)}%)
        </span>
      </div>
      <ProgressBar value={pct} tone={pct > 90 ? 'err' : pct > 75 ? 'warn' : 'accent'} />
    </div>
  )
}

export default function ResourceUsage({ r }: { r: R }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-panel p-4">
      <Row label="Host Memory (RAM)" used={r.ramUsedGb} total={r.ramTotalGb} />
      <Row label="Accelerator (VRAM)" used={r.gpuUsedGb} total={r.gpuTotalGb} />
    </div>
  )
}
