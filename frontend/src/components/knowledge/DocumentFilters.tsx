import Input from '../ui/Input'

export default function DocumentFilters({ search, type, types, onSearch, onType }: {
  search: string; type: string; types: string[]; onSearch: (v: string) => void; onType: (v: string) => void
}) {
  return (
    <div className="flex gap-2">
      <Input type="search" placeholder="Naam se search karo" value={search} onChange={(e) => onSearch(e.target.value)} className="max-w-xs" />
      <select value={type} onChange={(e) => onType(e.target.value)} className="rounded-md border border-line bg-panel px-2 text-sm" aria-label="File type">
        <option value="">All types</option>
        {types.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
      </select>
    </div>
  )
}
