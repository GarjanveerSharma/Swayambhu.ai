import { Check, Copy, RotateCcw } from 'lucide-react'
import IconButton from '../../ui/IconButton'
import { useCopy } from '../../../hooks/useCopy'
import { useT } from '../../../i18n'

export default function MessageActions({ content, canRegenerate, onRegenerate }: { content: string; canRegenerate: boolean; onRegenerate: () => void }) {
  const { copied, copy } = useCopy()
  const t = useT()
  return (
    <div className="flex gap-1">
      <IconButton label={t('chat.copy')} onClick={() => copy(content)}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </IconButton>
      {canRegenerate && (
        <IconButton label={t('chat.regenerate')} onClick={onRegenerate}>
          <RotateCcw size={15} />
        </IconButton>
      )}
    </div>
  )
}
