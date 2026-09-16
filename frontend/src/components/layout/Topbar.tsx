import NavLinks from './NavLinks'
import NetworkBadge from './NetworkBadge'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'

export default function Topbar() {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-line bg-panel px-4 py-2">
      <span className="font-semibold">Offline AI Workbench</span>
      <NavLinks />
      <div className="ml-auto flex items-center gap-2">
        <NetworkBadge />
        <LangToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
