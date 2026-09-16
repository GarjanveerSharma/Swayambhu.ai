import type { ServiceHealth } from '../../types/system'

export default function ServicesHealth({ services }: { services: ServiceHealth[] }) {
  return (
    <ul className="flex flex-wrap gap-3 rounded-md border border-line bg-panel p-3 text-sm">
      {services.map((s) => (
        <li key={s.name} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${s.up ? 'bg-ok' : 'bg-err'}`} aria-hidden />
          {s.name} <span className="text-muted">{s.up ? 'up' : 'down'}</span>
        </li>
      ))}
    </ul>
  )
}
