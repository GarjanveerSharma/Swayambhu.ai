import { Paperclip } from 'lucide-react'
import type { Message } from '../../../types/chat'

export default function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-[18px] bg-panel px-4 py-3 text-sm text-text">
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-line/50 pt-2">
            {message.attachments.map((a) => (
              <span
                key={a.id}
                className="flex items-center gap-1 rounded-full bg-bg/70 px-2 py-0.5 text-xs text-muted"
              >
                <Paperclip size={11} aria-hidden />
                {a.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
