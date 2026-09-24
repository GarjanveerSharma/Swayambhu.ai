import { useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import type { Chat } from '../../../types/chat'
import { useChatMutations } from '../../../hooks/useChats'
import { useChatStore } from '../../../store/chatStore'
import Dropdown from '../../ui/Dropdown'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { formatDate } from '../../../utils/formatDate'

export default function ChatListItem({ chat }: { chat: Chat }) {
  const { rename, remove } = useChatMutations()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(chat.title)
  const [confirm, setConfirm] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const isStreaming = useChatStore((s) => s.isStreaming)

  const saveTitle = () => {
    setEditing(false)
    if (title.trim() && title !== chat.title) rename.mutate({ id: chat.id, title: title.trim() })
  }

  return (
    <li>
      {editing ? (
        <input
          autoFocus
          className="w-full rounded-lg border border-line bg-bg px-2.5 py-1.5 text-sm outline-none focus:border-link/50 focus:ring-2 focus:ring-link/20"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
        />
      ) : (
        <NavLink
          to={`/chat/${chat.id}`}
          onClick={(e) => isStreaming && e.preventDefault()}
          className={({ isActive }) =>
            `group flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-100 ${
              isActive ? 'bg-bg text-text' : 'hover:bg-bg/60 text-text/80'
            }`
          }
        >
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium leading-snug">{chat.title}</div>
            {/* Date shown very small, muted */}
            <div className="mt-0.5 text-[11px] text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {formatDate(chat.updatedAt)}
            </div>
          </div>
          {/* "..." menu — visible on hover only */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
            <Dropdown
              trigger={
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-line hover:text-text"
                  aria-label="Chat options"
                >
                  <MoreHorizontal size={14} />
                </span>
              }
              items={[
                { label: 'Rename', onClick: () => setEditing(true) },
                { label: 'Delete', danger: true, onClick: () => setConfirm(true) },
              ]}
            />
          </div>
        </NavLink>
      )}
      <ConfirmDialog
        open={confirm}
        title="Delete chat?"
        message={`"${chat.title}" will be permanently deleted.`}
        onClose={() => setConfirm(false)}
        onConfirm={() =>
          remove.mutate(chat.id, {
            onSuccess: () => {
              if (id === chat.id) { useChatStore.getState().setActiveChat(null); navigate('/chat') }
            },
          })
        }
      />
    </li>
  )
}
