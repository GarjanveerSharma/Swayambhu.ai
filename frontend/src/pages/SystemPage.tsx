import { useState } from 'react'
import OutboundCounter from '../components/system/network/OutboundCounter'
import AirGapStatus from '../components/system/network/AirGapStatus'
import ConnectionsList from '../components/system/network/ConnectionsList'
import ConnectionChart from '../components/system/network/ConnectionChart'
import ModelsGrid from '../components/system/models/ModelsGrid'
import ResourceUsage from '../components/system/models/ResourceUsage'
import ServicesHealth from '../components/system/ServicesHealth'
import AuditFilters from '../components/system/audit/AuditFilters'
import AuditTable from '../components/system/audit/AuditTable'
import ExportCsvButton from '../components/system/audit/ExportCsvButton'
import Spinner from '../components/ui/Spinner'
import ErrorState from '../components/ui/ErrorState'
import { useNetworkStatus } from '../hooks/useNetworkStatus'
import { useSystemStatus } from '../hooks/useSystemStatus'
import { useAuditLogs } from '../hooks/useAuditLogs'

function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export default function SystemPage() {
  const net = useNetworkStatus()
  const sys = useSystemStatus()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const audit = useAuditLogs(from, to)

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-6 overflow-y-auto p-4">
      <Section title="Network monitor">
        {net.isLoading && <Spinner />}
        {net.error && <ErrorState error={net.error} onRetry={net.refetch} />}
        {net.data && (
          <>
            <div className="grid gap-3 md:grid-cols-[220px_1fr]">
              <OutboundCounter count={net.data.outbound} />
              <div className="flex flex-col gap-3">
                <AirGapStatus airGapped={net.data.airGapped} />
                <ConnectionChart data={net.data.history} />
              </div>
            </div>
            <ConnectionsList connections={net.data.connections} />
          </>
        )}
      </Section>

      <Section title="Models">
        {sys.isLoading && <Spinner />}
        {sys.error && <ErrorState error={sys.error} onRetry={sys.refetch} />}
        {sys.data && (
          <>
            <ModelsGrid models={sys.data.models} />
            <ResourceUsage r={sys.data.resources} />
          </>
        )}
      </Section>

      <Section title="Services">
        {sys.data && <ServicesHealth services={sys.data.services} />}
      </Section>

      <Section title="Audit log" right={<ExportCsvButton logs={audit.data ?? []} />}>
        <AuditFilters from={from} to={to} onFrom={setFrom} onTo={setTo} />
        {audit.isLoading && <Spinner />}
        {audit.error && <ErrorState error={audit.error} onRetry={audit.refetch} />}
        {audit.data && <AuditTable logs={audit.data} />}
      </Section>
    </div>
  )
}
