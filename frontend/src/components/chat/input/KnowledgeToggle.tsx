import { useChatStore } from '../../../store/chatStore'
import { useT } from '../../../i18n'

export default function KnowledgeToggle() {
  const { useKnowledge, setUseKnowledge } = useChatStore()
  const t = useT()

  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-[12px] text-muted select-none">
      {/* CSS toggle switch wrapping the existing checkbox */}
      <span className="relative inline-flex h-4 w-7 shrink-0 items-center">
        <input
          type="checkbox"
          checked={useKnowledge}
          onChange={(e) => setUseKnowledge(e.target.checked)}
          className="sr-only peer"
        />
        <span
          className="absolute inset-0 rounded-full bg-line transition-colors duration-150 peer-checked:bg-accent"
          aria-hidden
        />
        <span
          className="absolute left-0.5 h-3 w-3 rounded-full bg-bg shadow-sm transition-transform duration-150 peer-checked:translate-x-3"
          aria-hidden
        />
      </span>
      <span className={useKnowledge ? 'text-text' : ''}>{t('chat.useKb')}</span>
    </label>
  )
}
