import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="text-lg font-semibold">Ye page nahi mila</h1>
      <Link to="/" className="text-accent hover:underline">Chat pe wapas jao</Link>
    </div>
  )
}
