import { useUiStore } from '../../store/uiStore'

export default function LangToggle() {
  const { lang, toggleLang } = useUiStore()
  return (
    <button onClick={toggleLang} className="rounded-md border border-line px-2 py-1 text-xs" aria-label="Change language">
      {lang === 'en' ? 'हिं' : 'EN'}
    </button>
  )
}
