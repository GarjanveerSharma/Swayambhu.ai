import type { Connection } from '../../../types/network'
import Table from '../../ui/Table'
import Badge from '../../ui/Badge'

export default function ConnectionsList({ connections }: { connections: Connection[] }) {
  return (
    <Table headers={['Process', 'Local', 'Remote', 'Type']}>
      {connections.map((c, i) => (
        <tr key={i}>
          <td>{c.process}</td>
          <td className="font-mono text-xs">{c.local}</td>
          <td className="font-mono text-xs">{c.remote}</td>
          <td>{c.internal ? <Badge tone="ok">Internal</Badge> : <Badge tone="err">External</Badge>}</td>
        </tr>
      ))}
    </Table>
  )
}
