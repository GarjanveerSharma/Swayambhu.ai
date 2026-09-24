import { NavLink, useLocation } from 'react-router-dom'
import { Database, FileOutput, MessageSquare, Activity } from 'lucide-react'
import { useT, type TKey } from '../../i18n'

const links: { to: string; key: TKey; icon: typeof MessageSquare; end?: boolean }[] = [
  { to: '/chat',      key: 'nav.chat',      icon: MessageSquare },
  { to: '/knowledge', key: 'nav.knowledge', icon: Database },
  { to: '/files',     key: 'nav.files',     icon: FileOutput },
  { to: '/system',    key: 'nav.system',    icon: Activity },
]

export default function NavLinks() {
  const t = useT()
  const { pathname } = useLocation()

  return (
    <nav className="flex items-center gap-0.5" aria-label="Main navigation">
      {links.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => {
            const active = isActive || (to === '/chat' && pathname.startsWith('/chat'))
            return `flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] transition-colors duration-150 ${
              active
                ? 'bg-panel font-semibold text-text'
                : 'text-muted hover:text-text'
            }`
          }}
        >
          {/* Icon always visible on mobile; hidden on desktop for cleaner look */}
          <Icon size={15} className="shrink-0 sm:hidden" aria-hidden />
          <span className="hidden sm:inline">{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
