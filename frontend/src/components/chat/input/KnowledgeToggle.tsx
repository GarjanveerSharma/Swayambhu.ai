import { useChatStore } from '../../../store/chatStore'
import { useT } from '../../../i18n'

export default function KnowledgeToggle() {
  const { useKnowledge, setUseKnowledge } = useChatStore()
  const t = useT()
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted">
      <input type="checkbox" checked={useKnowledge} onChange={(e) => setUseKnowledge(e.target.checked)} />
      {t('chat.useKb')}
    </label>
  )
}
