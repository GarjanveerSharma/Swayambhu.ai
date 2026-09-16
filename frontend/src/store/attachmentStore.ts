import { create } from 'zustand'

export interface Attachment {
  id: string
  name: string
  uploading: boolean
}

interface AttachmentState {
  items: Attachment[]
  add: (a: Attachment) => void
  update: (localId: string, patch: Partial<Attachment>) => void
  remove: (id: string) => void
  clear: () => void
}

export const useAttachmentStore = create<AttachmentState>((set) => ({
  items: [],
  add: (a) => set((s) => ({ items: [...s.items, a] })),
  update: (localId, patch) => set((s) => ({ items: s.items.map((i) => (i.id === localId ? { ...i, ...patch } : i)) })),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}))
