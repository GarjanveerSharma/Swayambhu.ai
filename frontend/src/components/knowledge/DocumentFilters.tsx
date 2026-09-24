import Input from '../ui/Input'

export default function DocumentFilters({ search, type, types, onSearch, onType }: {
  search: string; type: string; types: string[]; onSearch: (v: string) => void; onType: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Input
        type="search"
        placeholder="Search documents…"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="h-9 max-w-xs text-xs"
      />
      <select
        value={type}
        onChange={(e) => onType(e.target.value)}
        className="h-9 rounded-lg border border-line bg-panel px-3 text-xs text-text transition-colors duration-150 focus:border-link/50 focus:outline-none focus:ring-2 focus:ring-link/20"
        aria-label="File type"
      >
        <option value="">All types</option>
        {types.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
      </select>
    </div>
  )
}
