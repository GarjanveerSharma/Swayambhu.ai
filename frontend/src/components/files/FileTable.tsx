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
          <tr key={f.id} className="group h-[52px]">
            <td>
              <span className="flex items-center gap-2.5 font-medium text-text">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-panel text-muted">
                  <Icon size={15} />
                </span>
                <span className="truncate max-w-xs">{f.name}</span>
              </span>
            </td>
            <td className="text-xs text-muted tabular-nums">{formatBytes(f.size)}</td>
            <td className="text-xs">
              {f.chatId ? (
                <Link className="text-link hover:underline" to={`/chat/${f.chatId}`}>
                  Open chat
                </Link>
              ) : (
                <span className="text-muted">–</span>
              )}
            </td>
            <td className="text-xs text-muted whitespace-nowrap">{formatDate(f.createdAt)}</td>
            <td className="text-right">
              <div className="flex items-center justify-end opacity-0 transition-opacity duration-150 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                <FileRowActions file={f} />
              </div>
            </td>
          </tr>
        )
      })}
    </Table>
  )
}
