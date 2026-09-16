import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PanelLeft } from 'lucide-react'
import ChatSidebar from '../components/chat/sidebar/ChatSidebar'
import MessageList from '../components/chat/messages/MessageList'
import ChatInput from '../components/chat/input/ChatInput'
import IconButton from '../components/ui/IconButton'
import Spinner from '../components/ui/Spinner'
import ErrorState from '../components/ui/ErrorState'
import { useChatDetail } from '../hooks/useChats'
import { useChatStream } from '../hooks/useChatStream'
import { useChatStore } from '../store/chatStore'
import { useUiStore } from '../store/uiStore'

export default function ChatPage() {
  const { id } = useParams()
  const { sidebarOpen, toggleSidebar } = useUiStore()
  const { send, stop, regenerate } = useChatStream()
  const [prefill, setPrefill] = useState('')
  const activeChatId = useChatStore((s) => s.activeChatId)
  const isStreaming = useChatStore((s) => s.isStreaming)

  // Jo chat store me pehle se active hai (abhi bani) use dobara fetch nahi karna
  const needsFetch = !!id && id !== activeChatId
  const { data, isLoading, error, refetch } = useChatDetail(needsFetch ? id : undefined)

  useEffect(() => {
    if (!id && !isStreaming) useChatStore.getState().setActiveChat(null)
  }, [id, isStreaming])

  useEffect(() => {
    if (data) useChatStore.getState().setActiveChat(data.id, data.messages ?? [])
  }, [data])

  return (
    <div className="flex h-full">
      {sidebarOpen && <ChatSidebar />}
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="px-2 pt-2">
          <IconButton label="Toggle sidebar" onClick={toggleSidebar}><PanelLeft size={18} /></IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {needsFetch && isLoading && <div className="p-6"><Spinner /></div>}
          {needsFetch && error && <div className="p-6"><ErrorState error={error} onRetry={refetch} /></div>}
          {!(needsFetch && (isLoading || error)) && <MessageList onRegenerate={regenerate} onPickExample={setPrefill} />}
        </div>
        <ChatInput onSend={send} onStop={stop} prefill={prefill} />
      </section>
    </div>
  )
}
