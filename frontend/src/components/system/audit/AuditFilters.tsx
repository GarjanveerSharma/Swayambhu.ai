export default function AuditFilters({
  from,
  to,
  onFrom,
  onTo,
}: {
  from: string
  to: string
  onFrom: (v: string) => void
  onTo: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
      <label className="flex items-center gap-1.5">
        <span>From</span>
        <input
          type="date"
          value={from}
          onChange={(e) => onFrom(e.target.value)}
          className="h-9 rounded-lg border border-line bg-panel px-2.5 text-xs text-text transition-colors duration-150 focus:border-link/50 focus:outline-none focus:ring-2 focus:ring-link/20"
        />
      </label>
      <label className="flex items-center gap-1.5">
        <span>To</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onTo(e.target.value)}
          className="h-9 rounded-lg border border-line bg-panel px-2.5 text-xs text-text transition-colors duration-150 focus:border-link/50 focus:outline-none focus:ring-2 focus:ring-link/20"
        />
      </label>
    </div>
  )
}
