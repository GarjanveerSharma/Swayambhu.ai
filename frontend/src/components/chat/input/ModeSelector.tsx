import { useChatStore } from '../../../store/chatStore'
import type { ChatMode } from '../../../types/chat'

const MODES: { value: ChatMode; label: string; hint: string }[] = [
  { value: 'auto', label: 'Auto', hint: 'System khud model chunega' },
  { value: 'fast', label: 'Fast', hint: 'Chhota, tez model' },
  { value: 'smart', label: 'Smart', hint: 'Bada reasoning model' },
]

export default function ModeSelector() {
  const { mode, setMode } = useChatStore()
  return (
    <div className="flex rounded-md border border-line text-xs" role="radiogroup" aria-label="Model mode">
      {MODES.map((m) => (
        <button
          key={m.value}
          role="radio"
          aria-checked={mode === m.value}
          title={m.hint}
          onClick={() => setMode(m.value)}
          className={`px-2 py-1 first:rounded-l-md last:rounded-r-md ${mode === m.value ? 'bg-accent text-white' : 'text-muted hover:bg-bg'}`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
