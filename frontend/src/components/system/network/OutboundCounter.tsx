export default function OutboundCounter({ count }: { count: number }) {
  const ok = count === 0
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-line bg-panel p-6 transition-colors duration-150">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-muted">Outbound connections</span>
        <span className="inline-flex items-center gap-1.5 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${ok ? 'bg-ok' : 'bg-err animate-status-pulse'}`}
            aria-hidden="true"
          />
          <span className={ok ? 'text-ok font-medium' : 'text-err font-medium'}>
            {ok ? 'Air-gapped' : 'Active connection'}
          </span>
        </span>
      </div>
      <div
        className={`my-3 text-7xl font-semibold tracking-tight tabular-nums ${
          ok ? 'text-text' : 'text-err'
        }`}
      >
        {count}
      </div>
      <p className="text-xs text-muted">
        {ok ? 'Zero bytes transmitted outside host' : 'Alert: traffic observed outside host'}
      </p>
    </div>
  )
}
