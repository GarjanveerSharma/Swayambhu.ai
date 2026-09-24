import { useState } from 'react'
import { Link } from 'react-router-dom'
import FileFilters from '../components/files/FileFilters'
import FileTable from '../components/files/FileTable'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useFiles } from '../hooks/useFiles'
import { useT } from '../i18n'

export default function FilesPage() {
  const { data, isLoading, error, refetch } = useFiles()
  const [type, setType] = useState('')
  const t = useT()
  const filtered = (data ?? []).filter((f) => !type || f.type === type)

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-6 overflow-y-auto px-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-text">{t('nav.files')}</h1>
        <p className="text-sm text-muted">Spreadsheets, documents, and reports created during conversations.</p>
      </div>

      <div className="flex flex-col gap-4">
        <FileFilters type={type} onType={setType} />
        {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {error && <ErrorState error={error} onRetry={refetch} />}
        {data && filtered.length === 0 && (
          <EmptyState
            text={t('files.empty')}
            action={<Link to="/chat" className="text-sm text-link hover:underline">Start a chat</Link>}
          />
        )}
        {filtered.length > 0 && <FileTable files={filtered} />}
      </div>
    </div>
  )
}
