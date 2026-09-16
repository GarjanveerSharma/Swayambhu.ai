import { useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import type { GeneratedFile } from '../../types/file'
import IconButton from '../ui/IconButton'
import ConfirmDialog from '../ui/ConfirmDialog'
import { downloadFile } from '../../api/files'
import { useDeleteFile } from '../../hooks/useFiles'
import { useUiStore } from '../../store/uiStore'

export default function FileRowActions({ file }: { file: GeneratedFile }) {
  const [confirm, setConfirm] = useState(false)
  const del = useDeleteFile()
  const toast = useUiStore((s) => s.toast)
  return (
    <span className="whitespace-nowrap">
      <IconButton label="Download" onClick={() => downloadFile(file).catch((e) => toast(e.message, 'error'))}><Download size={16} /></IconButton>
      <IconButton label="Delete" onClick={() => setConfirm(true)}><Trash2 size={16} /></IconButton>
      <ConfirmDialog
        open={confirm}
        title="File delete karein?"
        message={`"${file.name}" hat jayegi.`}
        onClose={() => setConfirm(false)}
        onConfirm={() => del.mutate(file.id, { onSuccess: () => toast('File deleted') })}
      />
    </span>
  )
}
