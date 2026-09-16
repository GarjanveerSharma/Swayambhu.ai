import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteDocument, listDocuments } from '../api/documents'
import { POLL } from '../constants/polling'

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: listDocuments,
    // Koi document processing me hai to baar baar refresh karo
    refetchInterval: (q) => (q.state.data?.some((d) => d.status === 'processing') ? POLL.documents : false),
  })
}

export function useDeleteDocument() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: deleteDocument, onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }) })
}
