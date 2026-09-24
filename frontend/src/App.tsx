import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import KnowledgePage from './pages/KnowledgePage'
import FilesPage from './pages/FilesPage'
import SystemPage from './pages/SystemPage'
import NotFoundPage from './pages/NotFoundPage'
import { useUiStore } from './store/uiStore'

export default function App() {
  const theme = useUiStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/system" element={<SystemPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
