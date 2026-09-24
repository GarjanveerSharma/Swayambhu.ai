import type { ButtonHTMLAttributes, ReactNode } from 'react'

export default function IconButton({
  label,
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-panel hover:text-text disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
