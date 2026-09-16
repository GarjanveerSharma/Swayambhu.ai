const TYPES = ['xlsx', 'docx', 'pdf', 'pptx']

export default function FileFilters({ type, onType }: { type: string; onType: (v: string) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="File type">
      {['', ...TYPES].map((t) => (
        <button
          key={t || 'all'}
          role="radio"
          aria-checked={type === t}
          onClick={() => onType(t)}
          className={`rounded-md border px-2 py-1 text-xs ${type === t ? 'border-accent text-accent' : 'border-line text-muted'}`}
        >
          {t ? t.toUpperCase() : 'All'}
        </button>
      ))}
    </div>
  )
}
