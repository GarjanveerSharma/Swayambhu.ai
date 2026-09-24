import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const styles: Record<Variant, string> = {
  primary:   'bg-accent text-bg hover:opacity-85 active:opacity-70',
  secondary: 'bg-bg border border-line text-text hover:bg-panel active:bg-panel',
  danger:    'border border-err text-err hover:bg-err/10 active:bg-err/20',
  ghost:     'text-text hover:bg-panel active:bg-panel',
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 h-10 text-sm font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    />
  )
}
