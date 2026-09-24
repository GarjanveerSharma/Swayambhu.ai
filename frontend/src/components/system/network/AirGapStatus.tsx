export default function AirGapStatus({ airGapped }: { airGapped: boolean }) {
  return airGapped ? (
    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-panel px-4 py-3 text-xs text-muted">
      <span className="h-2 w-2 rounded-full bg-ok shrink-0" aria-hidden="true" />
      <span>Air-gapped verification active. No external telemetry or network calls.</span>
    </div>
  ) : (
    <div className="flex items-center gap-2.5 rounded-xl border border-err/30 bg-err/5 px-4 py-3 text-xs text-err" role="alert">
      <span className="h-2 w-2 rounded-full bg-err shrink-0 animate-status-pulse" aria-hidden="true" />
      <span className="font-medium">Alert: external connection detected. Inspect list below.</span>
    </div>
  )
}
