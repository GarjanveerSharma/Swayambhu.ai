import { useT } from '../../../i18n'

const EXAMPLES = [
  'Pump P-101 ki servicing kab karni hai?',
  'Safety SOP ka summary do',
  'Maintenance checklist ki Excel bana do',
]

export default function EmptyChat({ onPick }: { onPick: (t: string) => void }) {
  const t = useT()
  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-text">
        {t('chat.emptyTitle')}
      </h1>
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => onPick(ex)}
            className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-all duration-150 hover:border-accent/30 hover:bg-panel hover:text-text"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
