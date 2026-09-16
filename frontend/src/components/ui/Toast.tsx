import { useUiStore } from '../../store/uiStore'

export default function ToastContainer() {
  const { toasts, dismissToast } = useUiStore()
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className={`max-w-sm rounded-md border bg-panel px-3 py-2 text-left text-sm shadow ${t.kind === 'error' ? 'border-err text-err' : 'border-line'}`}
        >
          {t.text}
        </button>
      ))}
    </div>
  )
}
