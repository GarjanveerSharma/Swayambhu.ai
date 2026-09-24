import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import type { Document } from '../../types/document'
import Table from '../ui/Table'
import IconButton from '../ui/IconButton'
import ConfirmDialog from '../ui/ConfirmDialog'
import DocStatusBadge from './DocStatusBadge'
import DocPreviewModal from './DocPreviewModal'
import { formatBytes } from '../../utils/formatBytes'
import { formatDate } from '../../utils/formatDate'
import { useDeleteDocument } from '../../hooks/useDocuments'

export default function DocumentTable({ docs }: { docs: Document[] }) {
  const [preview, setPreview] = useState<Document | null>(null)
  const [toDelete, setToDelete] = useState<Document | null>(null)
  const del = useDeleteDocument()

  return (
    <>
      <Table headers={['Name', 'Type', 'Size', 'Pages', 'Uploaded', 'Status', '']}>
        {docs.map((d) => (
          <tr key={d.id} className="group h-[52px]">
            <td className="max-w-xs truncate font-medium text-text">{d.name}</td>
            <td className="font-mono text-xs text-muted">{d.type.toUpperCase()}</td>
            <td className="text-xs text-muted tabular-nums">{formatBytes(d.size)}</td>
            <td className="text-xs text-muted tabular-nums">{d.pages ?? '–'}</td>
            <td className="text-xs text-muted whitespace-nowrap">{formatDate(d.uploadedAt)}</td>
            <td>
              <DocStatusBadge status={d.status} error={d.error} />
              {d.error && <div className="mt-0.5 text-[11px] text-err">{d.error}</div>}
            </td>
            <td className="whitespace-nowrap text-right">
              <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                <IconButton label="Preview text" disabled={d.status !== 'ready'} onClick={() => setPreview(d)}>
                  <Eye size={15} />
                </IconButton>
                <IconButton label="Delete" onClick={() => setToDelete(d)}>
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <DocPreviewModal doc={preview} onClose={() => setPreview(null)} />
      <ConfirmDialog
        open={!!toDelete}
        title="Delete document?"
        message={`"${toDelete?.name}" will be removed from the knowledge base.`}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && del.mutate(toDelete.id)}
      />
    </>
  )
}
