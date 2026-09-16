import { useEffect, useRef } from 'react'
import { useChatStore } from '../../../store/chatStore'
import UserMessage from './UserMessage'
import AssistantMessage from './AssistantMessage'
import EmptyChat from './EmptyChat'

export default function MessageList({ onRegenerate, onPickExample }: { onRegenerate: () => void; onPickExample: (t: string) => void }) {
  const messages = useChatStore((s) => s.messages)
  const isStreaming = useChatStore((s) => s.isStreaming)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  if (messages.length === 0) return <EmptyChat onPick={onPickExample} />

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6">
      {messages.map((m) =>
        m.role === 'user' ? (
          <UserMessage key={m.id} message={m} />
        ) : (
          <AssistantMessage
            key={m.id}
            message={m}
            streaming={isStreaming && m.id === lastAssistantId}
            canRegenerate={!isStreaming && m.id === lastAssistantId}
            onRegenerate={onRegenerate}
          />
        ),
      )}
      <div ref={bottomRef} />
    </div>
  )
}
