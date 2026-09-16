import { X } from 'lucide-react'
import { useAttachmentStore, type Attachment } from '../../../store/attachmentStore'
import Spinner from '../../ui/Spinner'

export default function AttachmentChip({ item }: { item: Attachment }) {
  const remove = useAttachmentStore((s) => s.remove)
  return (
    <span className="flex items-center gap-1 rounded border border-line px-2 py-0.5 text-xs">
      {item.uploading && <Spinner size={12} />}
      {item.name}
      <button aria-label={`Remove ${item.name}`} onClick={() => remove(item.id)} className="text-muted hover:text-err">
        <X size={12} />
      </button>
    </span>
  )
}
