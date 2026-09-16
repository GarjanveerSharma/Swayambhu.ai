import { Link } from 'react-router-dom'
import { Lock, ShieldAlert } from 'lucide-react'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useT } from '../../i18n'

export default function NetworkBadge() {
  const { data, isError } = useNetworkStatus()
  const t = useT()
  const bad = isError || (data && data.outbound > 0)
  return (
    <Link
      to="/system"
      className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ${bad ? 'border-err text-err' : 'border-ok text-ok'}`}
      title="Network monitor kholo"
    >
      {bad ? <ShieldAlert size={14} /> : <Lock size={14} />}
      {isError ? 'Status unknown' : `${t('network.offline')} · ${data?.outbound ?? '…'} ${t('network.outbound')}`}
    </Link>
  )
}
