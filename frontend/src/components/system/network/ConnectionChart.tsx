import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HistoryPoint } from '../../../types/network'

export default function ConnectionChart({ data }: { data: HistoryPoint[] }) {
  return (
    <div className="h-48 rounded-md border border-line bg-panel p-2">
      <div className="mb-1 text-xs text-muted">Outbound connections, last 10 minutes</div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
          <YAxis allowDecimals={false} domain={[0, 5]} tick={{ fontSize: 11, fill: 'var(--muted)' }} width={24} />
          <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--line)' }} />
          <Line type="stepAfter" dataKey="outbound" stroke="var(--ok)" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
