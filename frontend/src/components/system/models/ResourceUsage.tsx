import type { ResourceUsage as R } from '../../../types/system'
import ProgressBar from '../../ui/ProgressBar'

function Row({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = (used / total) * 100
  return (
    <div className="text-sm">
      <div className="mb-1 flex justify-between"><span>{label}</span><span className="text-muted">{used} / {total} GB</span></div>
      <ProgressBar value={pct} tone={pct > 90 ? 'err' : pct > 75 ? 'warn' : 'accent'} />
    </div>
  )
}

export default function ResourceUsage({ r }: { r: R }) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-panel p-3">
      <Row label="RAM" used={r.ramUsedGb} total={r.ramTotalGb} />
      <Row label="GPU memory" used={r.gpuUsedGb} total={r.gpuTotalGb} />
    </div>
  )
}
