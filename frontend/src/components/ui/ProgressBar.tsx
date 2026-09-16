export default function ProgressBar({ value, tone = 'accent' }: { value: number; tone?: 'accent' | 'err' | 'warn' }) {
  const color = { accent: 'bg-accent', err: 'bg-err', warn: 'bg-warn' }[tone]
  return (
    <div className="h-2 w-full overflow-hidden rounded bg-line" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}
