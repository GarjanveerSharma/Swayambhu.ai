import Button from './Button'

export default function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const msg = error instanceof Error ? error.message : 'Kuch galat ho gaya'
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-err p-3 text-sm text-err">
      <span>{msg}</span>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Retry</Button>}
    </div>
  )
}
