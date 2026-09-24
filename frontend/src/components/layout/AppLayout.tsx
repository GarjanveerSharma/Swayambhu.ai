import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import ToastContainer from '../ui/Toast'

export default function AppLayout() {
  return (
    <div className="flex h-full flex-col">
      <Topbar />
      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}
