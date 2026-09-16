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
          className="w-full rounded-md border border-accent bg-panel px-2 py-1.5 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
        />
      ) : (
        <NavLink
          to={`/chat/${chat.id}`}
          onClick={(e) => isStreaming && e.preventDefault()}
          className={({ isActive }) => `group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm ${isActive ? 'bg-bg' : 'hover:bg-bg'}`}
        >
          <div className="min-w-0 flex-1">
            <div className="truncate">{chat.title}</div>
            <div className="text-xs text-muted">{formatDate(chat.updatedAt)}</div>
          </div>
          <Dropdown
            trigger={<span className="rounded p-1 text-muted hover:text-text" aria-label="Chat options"><MoreHorizontal size={16} /></span>}
            items={[
              { label: 'Rename', onClick: () => setEditing(true) },
              { label: 'Delete', danger: true, onClick: () => setConfirm(true) },
            ]}
          />
        </NavLink>
      )}
      <ConfirmDialog
        open={confirm}
        title="Chat delete karein?"
        message={`"${chat.title}" hamesha ke liye hat jayegi.`}
        onClose={() => setConfirm(false)}
        onConfirm={() =>
          remove.mutate(chat.id, {
            onSuccess: () => {
              if (id === chat.id) { useChatStore.getState().setActiveChat(null); navigate('/') }
            },
          })
        }
      />
    </li>
  )
}
