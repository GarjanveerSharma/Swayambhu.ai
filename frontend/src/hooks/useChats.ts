import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteChat, getChat, listChats, renameChat } from '../api/chats'

export const useChatList = (search: string) =>
  useQuery({ queryKey: ['chats', search], queryFn: () => listChats(search) })

export const useChatDetail = (id: string | undefined) =>
  useQuery({ queryKey: ['chat', id], queryFn: () => getChat(id!), enabled: !!id })

export function useChatMutations() {
  const qc = useQueryClient()
  const refresh = () => qc.invalidateQueries({ queryKey: ['chats'] })
  return {
    rename: useMutation({ mutationFn: (v: { id: string; title: string }) => renameChat(v.id, v.title), onSuccess: refresh }),
    remove: useMutation({ mutationFn: deleteChat, onSuccess: refresh }),
  }
}
