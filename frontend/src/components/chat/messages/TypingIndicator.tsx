import Spinner from '../../ui/Spinner'

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-[13px] text-muted">
      <Spinner size={13} />
      <span>Thinking…</span>
    </div>
  )
}
