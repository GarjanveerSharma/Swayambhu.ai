import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HistoryPoint } from '../../../types/network'

export default function ConnectionChart({ data }: { data: HistoryPoint[] }) {
  return (
    <div className="flex h-48 flex-col justify-between rounded-2xl border border-line bg-panel p-4">
      <div className="text-xs font-medium text-muted">Outbound connections (last 10m)</div>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            {/* Minimal grid: only faint horizontal baseline */}
            <CartesianGrid vertical={false} stroke="var(--line)" strokeOpacity={0.5} strokeDasharray="2 2" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={{ stroke: 'var(--line)', strokeOpacity: 0.5 }}
              tick={{ fontSize: 10, fill: 'var(--muted)' }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, 5]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: 'var(--muted)' }}
              width={32}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--line)',
                borderRadius: '10px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            />
            <Line
              type="stepAfter"
              dataKey="outbound"
              stroke="var(--ok)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
