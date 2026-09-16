import { Paperclip } from 'lucide-react'
import type { Message } from '../../../types/chat'

export default function UserMessage({ message }: { message: Message }) {
  return (
    <div className="ml-auto max-w-[85%] rounded-lg bg-accent px-3 py-2 text-sm text-white">
      <p className="whitespace-pre-wrap">{message.content}</p>
      {message.attachments && message.attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {message.attachments.map((a) => (
            <span key={a.id} className="flex items-center gap-1 rounded bg-white/20 px-1.5 py-0.5 text-xs">
              <Paperclip size={12} /> {a.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
