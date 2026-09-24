import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useChatStore } from '../../../store/chatStore'
import { useT } from '../../../i18n'

export default function NewChatButton() {
  const navigate = useNavigate()
  const t = useT()
  const isStreaming = useChatStore((s) => s.isStreaming)

  return (
    <button
      disabled={isStreaming}
      onClick={() => {
        useChatStore.getState().setActiveChat(null)
        navigate('/chat')
      }}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-bg px-3 py-2 text-sm text-muted transition-colors duration-150 hover:border-accent/30 hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Plus size={15} />
      {t('chat.new')}
    </button>
  )
}
