import { useQuery } from '@tanstack/react-query'
import type { Document } from '../../types/document'
import { getDocumentPreview } from '../../api/documents'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import ErrorState from '../ui/ErrorState'

export default function DocPreviewModal({ doc, onClose }: { doc: Document | null; onClose: () => void }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['preview', doc?.id],
    queryFn: () => getDocumentPreview(doc!.id),
    enabled: !!doc,
  })
  return (
    <Modal open={!!doc} title={`Extracted text: ${doc?.name ?? ''}`} onClose={onClose}>
      {isLoading && <Spinner />}
      {error && <ErrorState error={error} />}
      {data && <pre className="whitespace-pre-wrap rounded-md bg-bg p-3 text-xs">{data}</pre>}
    </Modal>
  )
}
