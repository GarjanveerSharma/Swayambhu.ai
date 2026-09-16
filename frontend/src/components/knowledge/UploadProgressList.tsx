import type { UploadItem } from '../../hooks/useUpload'
import ProgressBar from '../ui/ProgressBar'

export default function UploadProgressList({ items }: { items: UploadItem[] }) {
  if (items.length === 0) return null
  return (
    <ul className="flex flex-col gap-2">
      {items.map((i) => (
        <li key={i.id} className="text-sm">
          <div className="mb-1 flex justify-between">
            <span>{i.name}</span>
            <span className={i.error ? 'text-err' : 'text-muted'}>{i.error ?? `${i.progress}%`}</span>
          </div>
          <ProgressBar value={i.error ? 100 : i.progress} tone={i.error ? 'err' : 'accent'} />
        </li>
      ))}
    </ul>
  )
}
