import { X } from 'lucide-react'
import { useAttachmentStore, type Attachment } from '../../../store/attachmentStore'
import Spinner from '../../ui/Spinner'

export default function AttachmentChip({ item }: { item: Attachment }) {
  const remove = useAttachmentStore((s) => s.remove)
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 text-[12px] text-muted">
      {item.uploading && <Spinner size={11} />}
      <span className="max-w-[160px] truncate">{item.name}</span>
      <button
        aria-label={`Remove ${item.name}`}
        onClick={() => remove(item.id)}
        className="ml-0.5 rounded-full text-muted/60 hover:text-err transition-colors duration-100"
      >
        <X size={11} />
      </button>
    </span>
  )
}
