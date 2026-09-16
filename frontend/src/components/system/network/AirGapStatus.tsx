import { ShieldAlert, ShieldCheck } from 'lucide-react'

export default function AirGapStatus({ airGapped }: { airGapped: boolean }) {
  return airGapped ? (
    <div className="flex items-center gap-2 rounded-md border border-ok p-3 text-ok">
      <ShieldCheck /> <span>Air-gapped. Is machine se koi data bahar nahi ja raha.</span>
    </div>
  ) : (
    <div className="flex items-center gap-2 rounded-md border border-err p-3 text-err" role="alert">
      <ShieldAlert /> <span>Alert: bahar ka connection mila. Neeche list check karo.</span>
    </div>
  )
}
