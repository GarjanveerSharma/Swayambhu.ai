import { forwardRef, type TextareaHTMLAttributes } from 'react'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full resize-none bg-transparent text-sm text-text placeholder:text-muted outline-none ${className}`}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
export default Textarea
