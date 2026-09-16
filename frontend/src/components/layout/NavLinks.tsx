import { NavLink, useLocation } from 'react-router-dom'
import { Database, FileOutput, MessageSquare, Activity } from 'lucide-react'
import { useT, type TKey } from '../../i18n'

const links: { to: string; key: TKey; icon: typeof MessageSquare; end?: boolean }[] = [
  { to: '/', key: 'nav.chat', icon: MessageSquare },
  { to: '/knowledge', key: 'nav.knowledge', icon: Database },
  { to: '/files', key: 'nav.files', icon: FileOutput },
  { to: '/system', key: 'nav.system', icon: Activity },
]

export default function NavLinks() {
  const t = useT()
  const { pathname } = useLocation()
  return (
    <nav className="flex gap-1">
      {links.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm ${isActive || (to === '/' && pathname.startsWith('/chat')) ? 'bg-bg font-medium text-accent' : 'text-muted hover:text-text'}`
          }
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
