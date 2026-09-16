import { create } from 'zustand'

type Theme = 'light' | 'dark'
type Lang = 'en' | 'hi'

interface UiState {
  sidebarOpen: boolean
  theme: Theme
  lang: Lang
  toasts: { id: number; text: string; kind: 'info' | 'error' }[]
  toggleSidebar: () => void
  toggleTheme: () => void
  toggleLang: () => void
  toast: (text: string, kind?: 'info' | 'error') => void
  dismissToast: (id: number) => void
}

const savedTheme = (() => {
  try { return (localStorage.getItem('theme') as Theme) || 'light' } catch { return 'light' }
})()

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: true,
  theme: savedTheme,
  lang: 'en',
  toasts: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleTheme: () => {
    const theme = get().theme === 'light' ? 'dark' : 'light'
    try { localStorage.setItem('theme', theme) } catch { /* ignore */ }
    set({ theme })
  },
  toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'hi' : 'en' })),
  toast: (text, kind = 'info') => {
    const id = Date.now() + Math.random()
    set((s) => ({ toasts: [...s.toasts, { id, text, kind }] }))
    setTimeout(() => get().dismissToast(id), 3500)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
