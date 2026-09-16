import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Button from '../../ui/Button'
import { useChatStore } from '../../../store/chatStore'
import { useT } from '../../../i18n'

export default function NewChatButton() {
  const navigate = useNavigate()
  const t = useT()
  const isStreaming = useChatStore((s) => s.isStreaming)
  return (
    <Button
      disabled={isStreaming}
      onClick={() => {
        useChatStore.getState().setActiveChat(null)
        navigate('/')
      }}
    >
      <Plus size={16} /> {t('chat.new')}
    </Button>
  )
}
