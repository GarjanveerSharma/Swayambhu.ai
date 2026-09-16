export default function AuditFilters({ from, to, onFrom, onTo }: { from: string; to: string; onFrom: (v: string) => void; onTo: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <label className="flex items-center gap-1">From <input type="date" value={from} onChange={(e) => onFrom(e.target.value)} className="rounded-md border border-line bg-panel px-2 py-1" /></label>
      <label className="flex items-center gap-1">To <input type="date" value={to} onChange={(e) => onTo(e.target.value)} className="rounded-md border border-line bg-panel px-2 py-1" /></label>
    </div>
  )
}
