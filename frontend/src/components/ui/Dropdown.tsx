import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface DropdownItem {
  label: string
  onClick: () => void
  danger?: boolean
}

export default function Dropdown({ trigger, items }: { trigger: ReactNode; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
      >
        {trigger}
      </div>
      {open && (
        <div className="absolute right-0 z-30 mt-1.5 min-w-[140px] rounded-xl border border-line bg-bg py-1 shadow-lg">
          {items.map((it) => (
            <button
              key={it.label}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors duration-100 hover:bg-panel ${
                it.danger ? 'text-err' : 'text-text'
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpen(false)
                it.onClick()
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
