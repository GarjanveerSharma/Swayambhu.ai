import type { AuditLog } from '../../../types/audit'
import Table from '../../ui/Table'
import { formatDate } from '../../../utils/formatDate'

export default function AuditTable({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return <p className="py-8 text-center text-xs text-muted">No audit logs found for this date range.</p>
  }
  return (
    <Table headers={['Timestamp', 'Prompt query', 'Model', 'Tools invoked', 'File artifact']}>
      {logs.map((l) => (
        <tr key={l.id} className="h-[52px]">
          <td className="whitespace-nowrap text-xs text-muted tabular-nums">{formatDate(l.time)}</td>
          <td className="max-w-xs truncate font-medium text-text" title={l.query}>
            {l.query}
          </td>
          <td className="font-mono text-xs text-muted">{l.model}</td>
          <td className="text-xs text-muted">{l.tools.join(', ') || '–'}</td>
          <td className="text-xs text-muted font-mono">{l.file ?? '–'}</td>
        </tr>
      ))}
    </Table>
  )
}
