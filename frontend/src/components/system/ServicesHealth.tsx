import type { ServiceHealth } from '../../types/system'

export default function ServicesHealth({ services }: { services: ServiceHealth[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-6 py-1 text-xs">
      {services.map((s) => (
        <li key={s.name} className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${s.up ? 'bg-ok' : 'bg-err animate-status-pulse'}`}
            aria-hidden="true"
          />
          <span className="font-medium text-text">{s.name}</span>
          <span className="text-muted">{s.up ? 'online' : 'offline'}</span>
        </li>
      ))}
    </ul>
  )
}
