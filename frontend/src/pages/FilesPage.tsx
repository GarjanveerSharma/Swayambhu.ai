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
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 overflow-y-auto p-4">
      <h1 className="text-lg font-semibold">{t('nav.files')}</h1>
      <FileFilters type={type} onType={setType} />
      {isLoading && <Spinner />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {data && filtered.length === 0 && (
        <EmptyState text={t('files.empty')} action={<Link to="/" className="text-sm text-accent hover:underline">Chat kholo</Link>} />
      )}
      {filtered.length > 0 && <FileTable files={filtered} />}
    </div>
  )
}
