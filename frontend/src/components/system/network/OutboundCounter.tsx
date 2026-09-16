export default function OutboundCounter({ count }: { count: number }) {
  const ok = count === 0
  return (
    <div className={`rounded-lg border-2 p-4 ${ok ? 'border-ok' : 'border-err'}`}>
      <div className="text-sm text-muted">Outbound internet connections</div>
      <div className={`text-6xl font-semibold tabular-nums ${ok ? 'text-ok' : 'text-err'}`}>{count}</div>
    </div>
  )
}
