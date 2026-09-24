import type { ReactNode } from 'react'

export default function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-bg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-muted tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line [&>tr]:transition-colors [&>tr]:duration-100 [&>tr:hover]:bg-panel [&_td]:px-4 [&_td]:py-3.5">
          {children}
        </tbody>
      </table>
    </div>
  )
}
