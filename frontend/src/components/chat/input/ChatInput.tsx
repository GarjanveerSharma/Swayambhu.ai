import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import Textarea from '../../ui/Textarea'
import Button from '../../ui/Button'
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

  // textarea apne aap badhe
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

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4">
      <div className="rounded-lg border border-line bg-panel p-2">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {attachments.map((a) => <AttachmentChip key={a.id} item={a} />)}
          </div>
        )}
        <Textarea
          ref={ref}
          rows={1}
          value={text}
          placeholder={t('chat.placeholder')}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          className="px-1 py-1"
          aria-label="Message"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <AttachButton />
          <ModeSelector />
          <KnowledgeToggle />
          <div className="ml-auto">
            {isStreaming ? (
              <Button variant="secondary" onClick={onStop}><Square size={14} /> {t('chat.stop')}</Button>
            ) : (
              <Button onClick={submit} disabled={!text.trim() || uploading}><Send size={14} /> {t('chat.send')}</Button>
            )}
          </div>
        </div>
      </div>
      <p className="mt-1 text-center text-xs text-muted">Enter se bhejo, Shift+Enter se nayi line</p>
    </div>
  )
}
