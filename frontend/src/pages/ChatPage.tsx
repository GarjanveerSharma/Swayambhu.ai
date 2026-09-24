import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const { sidebarOpen, toggleSidebar } = useUiStore()
  const { send, stop, regenerate } = useChatStream()
  const locationPrefill = (location.state as { prefill?: string } | null)?.prefill ?? ''
  const [prefill, setPrefill] = useState(locationPrefill)
  const activeChatId = useChatStore((s) => s.activeChatId)
  const isStreaming = useChatStore((s) => s.isStreaming)

  useEffect(() => {
    const p = (location.state as { prefill?: string } | null)?.prefill
    if (p) {
      setPrefill(p)
    }
  }, [location.state])

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
    <div className="relative flex h-full overflow-hidden">
      {sidebarOpen && (
        <>
          {/* Mobile slide-over backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px] md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-40 flex h-full md:static md:z-auto">
            <ChatSidebar />
          </div>
        </>
      )}
      <section className="flex min-w-0 flex-1 flex-col bg-bg">
        <div className="flex items-center px-4 pt-3">
          <IconButton label="Toggle sidebar" onClick={toggleSidebar}>
            <PanelLeft size={16} />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {needsFetch && isLoading && <div className="flex justify-center p-8"><Spinner /></div>}
          {needsFetch && error && <div className="mx-auto max-w-xl p-6"><ErrorState error={error} onRetry={refetch} /></div>}
          {!(needsFetch && (isLoading || error)) && <MessageList onRegenerate={regenerate} onPickExample={setPrefill} />}
        </div>
        <ChatInput onSend={send} onStop={stop} prefill={prefill} />
      </section>
    </div>
  )
}
