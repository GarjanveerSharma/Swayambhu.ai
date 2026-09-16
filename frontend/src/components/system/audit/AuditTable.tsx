import type { AuditLog } from '../../../types/audit'
import Table from '../../ui/Table'
import { formatDate } from '../../../utils/formatDate'

export default function AuditTable({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) return <p className="text-sm text-muted">Is date range me koi log nahi hai.</p>
  return (
    <Table headers={['Time', 'Query', 'Model', 'Tools', 'File']}>
      {logs.map((l) => (
        <tr key={l.id}>
          <td className="whitespace-nowrap">{formatDate(l.time)}</td>
          <td className="max-w-xs truncate" title={l.query}>{l.query}</td>
          <td className="font-mono text-xs">{l.model}</td>
          <td className="text-xs">{l.tools.join(', ') || '–'}</td>
          <td className="text-xs">{l.file ?? '–'}</td>
        </tr>
      ))}
    </Table>
  )
}
