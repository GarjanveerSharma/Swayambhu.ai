import { useMemo, useState } from 'react'
import UploadDropzone from '../components/knowledge/UploadDropzone'
import UploadProgressList from '../components/knowledge/UploadProgressList'
import DocumentFilters from '../components/knowledge/DocumentFilters'
import DocumentTable from '../components/knowledge/DocumentTable'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useDocuments } from '../hooks/useDocuments'
import { useUpload } from '../hooks/useUpload'
import { useT } from '../i18n'

export default function KnowledgePage() {
  const { data, isLoading, error, refetch } = useDocuments()
  const { items, upload } = useUpload()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const t = useT()

  const types = useMemo(() => [...new Set(data?.map((d) => d.type) ?? [])], [data])
  const filtered = useMemo(
    () => (data ?? []).filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) && (!type || d.type === type)),
    [data, search, type],
  )

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 overflow-y-auto p-4">
      <h1 className="text-lg font-semibold">{t('nav.knowledge')}</h1>
      <p className="text-sm text-muted">Yahan upload kiye gaye documents se AI jawab dega. Scanned files ka text OCR se nikala jata hai.</p>
      <UploadDropzone onFiles={upload} />
      <UploadProgressList items={items} />
      <DocumentFilters search={search} type={type} types={types} onSearch={setSearch} onType={setType} />
      {isLoading && <Spinner />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {data && data.length === 0 && <EmptyState text={t('kb.empty')} />}
      {data && data.length > 0 && <DocumentTable docs={filtered} />}
    </div>
  )
}
