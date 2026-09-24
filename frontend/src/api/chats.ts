import { api } from './client'
import { db, delay } from '../mocks/db'
import type { Chat } from '../types/chat'

export async function listChats(search = ''): Promise<Chat[]> {
  if (false) {
    await delay()
    return db.chats
      .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
      .map(({ messages: _m, ...rest }) => rest)
  }
  return (await api.get('/chats', { params: { q: search } })).data
}

export async function getChat(id: string): Promise<Chat> {
  if (false) {
    await delay()
    const chat = db.chats.find((c) => c.id === id)
    if (!chat) throw new Error('Chat nahi mili')
    return structuredClone(chat) as Chat
  }
  return (await api.get(`/chats/${id}`)).data
}

export async function renameChat(id: string, title: string) {
  if (false) {
    const foundChat = db.chats.find((c) => c.id === id)
    if (!foundChat) return
    const existingChat: Chat = foundChat as Chat
    existingChat.title = title
    return
  }
  await api.patch(`/chats/${id}`, { title })
}

export async function deleteChat(id: string) {
  if (false) {
    db.chats = db.chats.filter((c) => c.id !== id)
    return
  }
  await api.delete(`/chats/${id}`)
}
