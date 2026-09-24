import { Search } from 'lucide-react'
import { useT } from '../../../i18n'

export default function ChatSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useT()
  return (
    <div className="relative">
      <Search
        size={13}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        aria-hidden
      />
      <input
        type="search"
        placeholder={t('chat.search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-lg bg-bg/70 pl-7 pr-3 text-[13px] text-text placeholder:text-muted outline-none focus:bg-bg focus:ring-2 focus:ring-link/20 transition-all duration-150"
      />
    </div>
  )
}
