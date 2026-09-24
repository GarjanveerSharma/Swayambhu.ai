import { useChatStore } from '../../../store/chatStore'
import type { ChatMode } from '../../../types/chat'

const MODES: { value: ChatMode; label: string; hint: string }[] = [
  { value: 'auto',  label: 'Auto',  hint: 'System chooses the best model' },
  { value: 'fast',  label: 'Fast',  hint: 'Smaller, faster model' },
  { value: 'smart', label: 'Smart', hint: 'Larger reasoning model' },
]

export default function ModeSelector() {
  const { mode, setMode } = useChatStore()

  return (
    <div
      className="flex items-center rounded-lg bg-panel p-0.5 text-[12px]"
      role="radiogroup"
      aria-label="Model mode"
    >
      {MODES.map((m) => (
        <button
          key={m.value}
          role="radio"
          aria-checked={mode === m.value}
          title={m.hint}
          onClick={() => setMode(m.value)}
          className={`rounded-md px-2.5 py-1 transition-all duration-150 ${
            mode === m.value
              ? 'bg-bg text-text shadow-sm shadow-black/10'
              : 'text-muted hover:text-text'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
