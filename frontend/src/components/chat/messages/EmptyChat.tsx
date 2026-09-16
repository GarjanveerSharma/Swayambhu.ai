import { useT } from '../../../i18n'

const EXAMPLES = [
  'Pump P-101 ki servicing kab karni hai?',
  'Safety SOP ka summary do',
  'Maintenance checklist ki Excel bana do',
]

export default function EmptyChat({ onPick }: { onPick: (t: string) => void }) {
  const t = useT()
  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold">{t('chat.emptyTitle')}</h1>
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((ex) => (
          <button key={ex} onClick={() => onPick(ex)} className="rounded-md border border-line bg-panel px-3 py-1.5 text-sm hover:bg-bg">
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
