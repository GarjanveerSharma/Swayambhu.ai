const TYPES = ['xlsx', 'docx', 'pdf', 'pptx']

export default function FileFilters({ type, onType }: { type: string; onType: (v: string) => void }) {
  return (
    <div className="inline-flex self-start items-center rounded-lg bg-panel p-0.5 text-xs" role="radiogroup" aria-label="File type">
      {['', ...TYPES].map((t) => {
        const isSelected = type === t
        return (
          <button
            key={t || 'all'}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onType(t)}
            className={`rounded-md px-3 py-1 font-medium transition-all duration-150 ${
              isSelected
                ? 'bg-bg text-text shadow-sm shadow-black/10'
                : 'text-muted hover:text-text'
            }`}
          >
            {t ? t.toUpperCase() : 'All'}
          </button>
        )
      })}
    </div>
  )
}
