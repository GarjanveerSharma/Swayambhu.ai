import { useUiStore } from '../../store/uiStore'

export default function ToastContainer() {
  const { toasts, dismissToast } = useUiStore()
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className={`max-w-sm rounded-full px-4 py-2 text-sm shadow-lg transition-all duration-150 ${
            t.kind === 'error'
              ? 'bg-err text-white'
              : 'bg-text text-bg'
          }`}
        >
          {t.text}
        </button>
      ))}
    </div>
  )
}
