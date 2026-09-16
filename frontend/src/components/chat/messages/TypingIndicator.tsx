import Spinner from '../../ui/Spinner'

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <Spinner size={14} /> Soch raha hai…
    </div>
  )
}
