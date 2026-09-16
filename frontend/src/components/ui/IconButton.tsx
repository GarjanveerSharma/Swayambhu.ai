import type { ButtonHTMLAttributes, ReactNode } from 'react'

export default function IconButton({ label, children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return (
    <button aria-label={label} title={label} className={`rounded-md p-1.5 text-muted hover:bg-bg hover:text-text disabled:opacity-40 ${className}`} {...props}>
      {children}
    </button>
  )
}
