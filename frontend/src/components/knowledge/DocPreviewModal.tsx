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
    <Modal open={!!doc} title={`Preview: ${doc?.name ?? ''}`} onClose={onClose}>
      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
      {error && <ErrorState error={error} />}
      {data && (
        <pre className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-line bg-panel p-4 font-mono text-xs text-text leading-relaxed">
          {data}
        </pre>
      )}
    </Modal>
  )
}
