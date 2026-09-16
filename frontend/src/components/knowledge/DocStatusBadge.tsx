import type { DocStatus } from '../../types/document'
import Badge from '../ui/Badge'
import Spinner from '../ui/Spinner'

export default function DocStatusBadge({ status, error }: { status: DocStatus; error?: string }) {
  if (status === 'processing') return <Badge tone="warn"><Spinner size={12} /> Processing</Badge>
  if (status === 'failed') return <span title={error}><Badge tone="err">Failed</Badge></span>
  return <Badge tone="ok">Ready</Badge>
}
