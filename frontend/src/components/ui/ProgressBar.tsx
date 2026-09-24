export default function ProgressBar({
  value,
  tone = 'accent',
}: {
  value: number
  tone?: 'accent' | 'err' | 'warn'
}) {
  const color = { accent: 'bg-accent', err: 'bg-err', warn: 'bg-warn' }[tone]
  return (
    <div
      className="h-0.5 w-full overflow-hidden rounded-full bg-line"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full transition-all duration-300 ${color}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  )
}
