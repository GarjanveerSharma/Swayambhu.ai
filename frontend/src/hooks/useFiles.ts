import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteFile, listFiles } from '../api/files'

export const useFiles = () => useQuery({ queryKey: ['files'], queryFn: listFiles })

export function useDeleteFile() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: deleteFile, onSuccess: () => qc.invalidateQueries({ queryKey: ['files'] }) })
}
