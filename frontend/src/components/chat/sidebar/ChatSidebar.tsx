import { useState } from 'react'
import { useChatList } from '../../../hooks/useChats'
import NewChatButton from './NewChatButton'
import ChatSearch from './ChatSearch'
import ChatListItem from './ChatListItem'
import Spinner from '../../ui/Spinner'
import ErrorState from '../../ui/ErrorState'

export default function ChatSidebar() {
  const [search, setSearch] = useState('')
  const { data, isLoading, error, refetch } = useChatList(search)
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-2 border-r border-line bg-panel p-3">
      <NewChatButton />
      <ChatSearch value={search} onChange={setSearch} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && <Spinner />}
        {error && <ErrorState error={error} onRetry={refetch} />}
        {data?.length === 0 && <p className="p-2 text-xs text-muted">Koi chat nahi mili.</p>}
        <ul className="flex flex-col gap-0.5">
          {data?.map((c) => <ChatListItem key={c.id} chat={c} />)}
        </ul>
      </div>
    </aside>
  )
}
