import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import Textarea from '../../ui/Textarea'
import AttachButton from './AttachButton'
import AttachmentChip from './AttachmentChip'
import ModeSelector from './ModeSelector'
import KnowledgeToggle from './KnowledgeToggle'
import { useChatStore } from '../../../store/chatStore'
import { useAttachmentStore } from '../../../store/attachmentStore'
import { useT } from '../../../i18n'

interface Props {
  onSend: (text: string) => void
  onStop: () => void
  prefill: string
}

export default function ChatInput({ onSend, onStop, prefill }: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const isStreaming = useChatStore((s) => s.isStreaming)
  const attachments = useAttachmentStore((s) => s.items)
  const t = useT()
  const uploading = attachments.some((a) => a.uploading)

  useEffect(() => {
    if (prefill) { setText(prefill); ref.current?.focus() }
  }, [prefill])

  // Auto-grow textarea
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [text])

  const submit = () => {
    const v = text.trim()
    if (!v || isStreaming || uploading) return
    onSend(v)
    setText('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const canSend = !!text.trim() && !uploading

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 pb-5">
      {/* Floating input box */}
      <div className="rounded-3xl border border-line bg-bg shadow-sm shadow-black/[0.06] transition-shadow duration-150 focus-within:shadow-md focus-within:shadow-black/[0.08]">
        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pt-3">
            {attachments.map((a) => <AttachmentChip key={a.id} item={a} />)}
          </div>
        )}

        {/* Textarea */}
        <Textarea
          ref={ref}
          rows={1}
          value={text}
          placeholder={t('chat.placeholder')}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          className="px-4 pt-3.5 pb-1"
          aria-label="Message"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center gap-2 px-3 pb-3 pt-1">
          <AttachButton />
          <ModeSelector />
          <KnowledgeToggle />

          {/* Send / Stop — right side */}
          <div className="ml-auto">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-bg transition-opacity duration-150 hover:opacity-80"
                aria-label={t('chat.stop')}
                title={t('chat.stop')}
              >
                <Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!canSend}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-bg transition-all duration-150 hover:opacity-85 disabled:opacity-30"
                aria-label={t('chat.send')}
                title={t('chat.send')}
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* "Enter to send" hint removed as per spec */}
    </div>
  )
}
