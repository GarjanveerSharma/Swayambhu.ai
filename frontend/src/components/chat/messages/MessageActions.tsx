import { Check, Copy, RotateCcw } from 'lucide-react'
import IconButton from '../../ui/IconButton'
import { useCopy } from '../../../hooks/useCopy'
import { useT } from '../../../i18n'

export default function MessageActions({
  content,
  canRegenerate,
  onRegenerate,
}: {
  content: string
  canRegenerate: boolean
  onRegenerate: () => void
}) {
  const { copied, copy } = useCopy()
  const t = useT()

  return (
    /* opacity-0 on non-touch, revealed on parent group-hover; always visible on touch */
    <div className="flex gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
      <IconButton label={t('chat.copy')} onClick={() => copy(content)}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </IconButton>
      {canRegenerate && (
        <IconButton label={t('chat.regenerate')} onClick={onRegenerate}>
          <RotateCcw size={14} />
        </IconButton>
      )}
    </div>
  )
}
