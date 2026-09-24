import { Download } from 'lucide-react'
import type { GeneratedFile } from '../../../types/file'
import { fileIcon } from '../../../utils/fileIcon'
import { formatBytes } from '../../../utils/formatBytes'
import { downloadFile } from '../../../api/files'
import { useUiStore } from '../../../store/uiStore'
import IconButton from '../../ui/IconButton'

export default function FileCard({ file }: { file: GeneratedFile }) {
  const Icon = fileIcon(file.name)
  const toast = useUiStore((s) => s.toast)
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-bg px-3 py-2.5">
      {/* Icon in a soft gray square */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel">
        <Icon size={18} className="text-muted" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-text">{file.name}</div>
        <div className="text-[12px] text-muted">{formatBytes(file.size)}</div>
      </div>
      <IconButton
        label="Download"
        onClick={() => downloadFile(file).catch((e) => toast(e.message, 'error'))}
        className="shrink-0"
      >
        <Download size={15} />
      </IconButton>
    </div>
  )
}
