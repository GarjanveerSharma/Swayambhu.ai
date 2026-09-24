import { Loader2 } from 'lucide-react'

export default function Spinner({ size = 16 }: { size?: number }) {
  return (
    <Loader2
      size={size}
      className="animate-spin text-muted"
      aria-label="Loading"
      role="status"
    />
  )
}
