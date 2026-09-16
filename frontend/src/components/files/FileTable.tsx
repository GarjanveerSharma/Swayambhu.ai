import { Link } from 'react-router-dom'
import type { GeneratedFile } from '../../types/file'
import Table from '../ui/Table'
import FileRowActions from './FileRowActions'
import { fileIcon } from '../../utils/fileIcon'
import { formatBytes } from '../../utils/formatBytes'
import { formatDate } from '../../utils/formatDate'

export default function FileTable({ files }: { files: GeneratedFile[] }) {
  return (
    <Table headers={['Name', 'Size', 'From chat', 'Created', '']}>
      {files.map((f) => {
        const Icon = fileIcon(f.name)
        return (
          <tr key={f.id}>
            <td><span className="flex items-center gap-2"><Icon size={16} className="text-accent" /> {f.name}</span></td>
            <td>{formatBytes(f.size)}</td>
            <td>{f.chatId ? <Link className="text-accent hover:underline" to={`/chat/${f.chatId}`}>Open chat</Link> : <span className="text-muted">–</span>}</td>
            <td>{formatDate(f.createdAt)}</td>
            <td className="text-right"><FileRowActions file={f} /></td>
          </tr>
        )
      })}
    </Table>
  )
}
