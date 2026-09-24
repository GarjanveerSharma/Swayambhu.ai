import type { DocStatus } from '../../types/document'

export default function DocStatusBadge({ status, error }: { status: DocStatus; error?: string }) {
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-warn">
        <span className="h-1.5 w-1.5 rounded-full bg-warn animate-status-pulse shrink-0" aria-hidden="true" />
        Processing
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-err" title={error}>
        <span className="h-1.5 w-1.5 rounded-full bg-err shrink-0" aria-hidden="true" />
        Failed
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ok">
      <span className="h-1.5 w-1.5 rounded-full bg-ok shrink-0" aria-hidden="true" />
      Ready
    </span>
  )
}
