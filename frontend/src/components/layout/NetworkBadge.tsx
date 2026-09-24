import { Link } from 'react-router-dom'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useT } from '../../i18n'

export default function NetworkBadge() {
  const { data, isError } = useNetworkStatus()
  const t = useT()
  const bad = isError || (data && data.outbound > 0)

  return (
    <Link
      to="/system"
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors duration-150 ${
        bad
          ? 'border-err/30 text-err'
          : 'border-ok/30 text-ok'
      }`}
      title="Open network monitor"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${bad ? 'bg-err' : 'bg-ok'}`}
        aria-hidden
      />
      {isError
        ? 'Unknown'
        : `${t('network.offline')} · ${data?.outbound ?? '…'}`}
    </Link>
  )
}
