import type { InputHTMLAttributes } from 'react'

export default function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-10 w-full rounded-lg border border-line bg-panel px-3 text-sm text-text placeholder:text-muted transition-colors duration-150 focus:border-link/50 focus:outline-none focus:ring-2 focus:ring-link/20 ${className}`}
      {...props}
    />
  )
}
