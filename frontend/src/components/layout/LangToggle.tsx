import { useUiStore } from '../../store/uiStore'

export default function LangToggle() {
  const { lang, toggleLang } = useUiStore()
  return (
    <button
      onClick={toggleLang}
      className="flex h-8 w-8 items-center justify-center rounded-md text-xs text-muted transition-colors duration-150 hover:bg-panel hover:text-text"
      aria-label="Change language"
    >
      {lang === 'en' ? 'हिं' : 'EN'}
    </button>
  )
}
