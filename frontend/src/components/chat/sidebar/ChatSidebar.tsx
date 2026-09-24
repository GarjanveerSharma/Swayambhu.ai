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
    <aside className="flex w-[260px] shrink-0 flex-col gap-1.5 border-r border-line bg-panel p-3">
      <NewChatButton />
      <ChatSearch value={search} onChange={setSearch} />
      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        {isLoading && (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
        {error && <ErrorState error={error} onRetry={refetch} />}
        {data?.length === 0 && (
          <p className="px-2 py-4 text-xs text-muted">No chats yet.</p>
        )}
        <ul className="flex flex-col gap-px">
          {data?.map((c) => <ChatListItem key={c.id} chat={c} />)}
        </ul>
      </div>
    </aside>
  )
}
