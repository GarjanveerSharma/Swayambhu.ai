import type { Connection } from '../../../types/network'
import Table from '../../ui/Table'
import Badge from '../../ui/Badge'

export default function ConnectionsList({ connections }: { connections: Connection[] }) {
  return (
    <Table headers={['Process', 'Local address', 'Remote address', 'Scope']}>
      {connections.map((c, i) => (
        <tr key={i} className="h-[52px]">
          <td className="font-medium text-text">{c.process}</td>
          <td className="font-mono text-xs text-muted">{c.local}</td>
          <td className="font-mono text-xs text-muted">{c.remote}</td>
          <td>
            {c.internal ? (
              <Badge tone="ok">Internal</Badge>
            ) : (
              <Badge tone="err">External</Badge>
            )}
          </td>
        </tr>
      ))}
    </Table>
  )
}
