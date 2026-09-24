import Button from './Button'

export default function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const msg = error instanceof Error ? error.message : 'Something went wrong'
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-err/30 bg-err/5 p-4 text-sm text-err">
      <span>{msg}</span>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="shrink-0 text-err border-err/40">
          Retry
        </Button>
      )}
    </div>
  )
}
