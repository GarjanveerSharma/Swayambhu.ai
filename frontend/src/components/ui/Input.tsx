import type { InputHTMLAttributes } from 'react'

export default function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`w-full rounded-md border border-line bg-panel px-3 py-1.5 text-sm ${className}`} {...props} />
}
