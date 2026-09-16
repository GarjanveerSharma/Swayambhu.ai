import type { ReactNode } from 'react'

export default function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-panel">
      <table className="w-full text-sm">
        <thead className="border-b border-line text-left text-muted">
          <tr>{headers.map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="[&>tr]:border-b [&>tr]:border-line [&>tr:last-child]:border-0 [&_td]:px-3 [&_td]:py-2">{children}</tbody>
      </table>
    </div>
  )
}
