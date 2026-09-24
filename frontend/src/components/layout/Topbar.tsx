import { Link } from 'react-router-dom'
import NavLinks from './NavLinks'
import NetworkBadge from './NetworkBadge'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'
import { USE_MOCKS } from '../../constants/config'

export default function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-bg px-4">
      {/* Brand */}
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2.5 text-text transition-opacity hover:opacity-80"
        title="Go to home"
      >
        <img
          src="/Swayambhu.ai--LOGO.png"
          alt="Swayambhu.ai logo"
          className="h-7 w-7 object-contain"
        />
        <span className="text-[15px] font-semibold tracking-tight text-text">
          Swayambhu.ai
        </span>
      </Link>

      {/* Nav */}
      <NavLinks />

      {/* Right group */}
      <div className="ml-auto flex items-center gap-1.5">
        {/* Mock mode pill — tiny, muted, non-distracting */}
        {USE_MOCKS && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-warn/10 px-2.5 py-0.5 text-xs text-warn">
            Mock
          </span>
        )}
        <NetworkBadge />
        <LangToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
