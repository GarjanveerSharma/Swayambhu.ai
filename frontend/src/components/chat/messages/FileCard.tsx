import { Download } from 'lucide-react'
import type { GeneratedFile } from '../../../types/file'
import { fileIcon } from '../../../utils/fileIcon'
import { formatBytes } from '../../../utils/formatBytes'
import { downloadFile } from '../../../api/files'
import { useUiStore } from '../../../store/uiStore'

export default function FileCard({ file }: { file: GeneratedFile }) {
  const Icon = fileIcon(file.name)
  const toast = useUiStore((s) => s.toast)
  return (
    <div className="flex items-center gap-3 rounded-md border border-line px-3 py-2">
      <Icon size={22} className="text-accent" />
      <div className="text-sm">
        <div className="font-medium">{file.name}</div>
        <div className="text-xs text-muted">{formatBytes(file.size)}</div>
      </div>
      <button
        className="ml-2 flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs hover:bg-bg"
        onClick={() => downloadFile(file).catch((e) => toast(e.message, 'error'))}
      >
        <Download size={14} /> Download
      </button>
    </div>
  )
}
