import type { Source } from '../../../types/stream'
import SourceItem from './SourceItem'
import { useT } from '../../../i18n'

export default function SourcesPanel({ sources }: { sources: Source[] }) {
  const t = useT()
  return (
    <div className="border-t border-line pt-2">
      <div className="mb-1 text-xs font-medium text-muted">{t('chat.sources')}</div>
      <ul className="flex flex-col gap-1">
        {sources.map((s, i) => <SourceItem key={`${s.docId}-${s.page}-${i}`} index={i + 1} source={s} />)}
      </ul>
    </div>
  )
}
