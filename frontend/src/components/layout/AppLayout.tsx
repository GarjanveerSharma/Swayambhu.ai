import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import ToastContainer from '../ui/Toast'
import { USE_MOCKS } from '../../constants/config'

export default function AppLayout() {
  return (
    <div className="flex h-full flex-col">
      <Topbar />
      {USE_MOCKS && (
        <div className="border-b border-line bg-panel px-4 py-1 text-xs text-warn">
          Mock mode: fake data dikh raha hai. Backend jodne ke liye .env me VITE_USE_MOCKS=false karo.
        </div>
      )}
      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}
