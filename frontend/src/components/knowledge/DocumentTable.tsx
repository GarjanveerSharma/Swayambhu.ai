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
          <tr key={d.id}>
            <td className="max-w-xs truncate">{d.name}</td>
            <td>{d.type.toUpperCase()}</td>
            <td>{formatBytes(d.size)}</td>
            <td>{d.pages ?? '–'}</td>
            <td>{formatDate(d.uploadedAt)}</td>
            <td>
              <DocStatusBadge status={d.status} error={d.error} />
              {d.error && <div className="mt-1 text-xs text-err">{d.error}</div>}
            </td>
            <td className="whitespace-nowrap text-right">
              <IconButton label="Preview text" disabled={d.status !== 'ready'} onClick={() => setPreview(d)}><Eye size={16} /></IconButton>
              <IconButton label="Delete" onClick={() => setToDelete(d)}><Trash2 size={16} /></IconButton>
            </td>
          </tr>
        ))}
      </Table>
      <DocPreviewModal doc={preview} onClose={() => setPreview(null)} />
      <ConfirmDialog
        open={!!toDelete}
        title="Document delete karein?"
        message={`"${toDelete?.name}" knowledge base se hat jayega. AI iske baare me jawab nahi de payega.`}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && del.mutate(toDelete.id)}
      />
    </>
  )
}
