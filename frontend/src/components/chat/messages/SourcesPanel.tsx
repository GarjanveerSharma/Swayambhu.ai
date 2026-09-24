import type { Source } from '../../../types/stream'
import SourceItem from './SourceItem'

export default function SourcesPanel({ sources }: { sources: Source[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[12px] font-semibold uppercase tracking-wider text-muted/70">
        Sources
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {sources.map((s, i) => (
          <SourceItem key={`${s.docId}-${s.page}-${i}`} index={i + 1} source={s} />
        ))}
      </ul>
    </div>
  )
}
