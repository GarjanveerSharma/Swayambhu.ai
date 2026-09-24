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
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-text">{title}</h2>
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
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-12 overflow-y-auto px-6 py-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-text">System telemetry</h1>
        <p className="text-sm text-muted">Real-time hardware utilisation, model state, and air-gap network audit.</p>
      </div>

      {/* Network monitor hero */}
      <Section title="Network isolation">
        {net.isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {net.error && <ErrorState error={net.error} onRetry={net.refetch} />}
        {net.data && (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-[300px_1fr]">
              <OutboundCounter count={net.data.outbound} />
              <div className="flex flex-col gap-3">
                <AirGapStatus airGapped={net.data.airGapped} />
                <ConnectionChart data={net.data.history} />
              </div>
            </div>
            <div className="mt-2">
              <ConnectionsList connections={net.data.connections} />
            </div>
          </div>
        )}
      </Section>

      {/* Models & Hardware */}
      <Section title="Active models">
        {sys.isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {sys.error && <ErrorState error={sys.error} onRetry={sys.refetch} />}
        {sys.data && (
          <div className="flex flex-col gap-4">
            <ModelsGrid models={sys.data.models} />
            <ResourceUsage r={sys.data.resources} />
          </div>
        )}
      </Section>

      {/* Services health */}
      <Section title="Service daemons">
        {sys.data && <ServicesHealth services={sys.data.services} />}
      </Section>

      {/* Audit log */}
      <Section title="Security audit log" right={<ExportCsvButton logs={audit.data ?? []} />}>
        <div className="flex flex-col gap-3">
          <AuditFilters from={from} to={to} onFrom={setFrom} onTo={setTo} />
          {audit.isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
          {audit.error && <ErrorState error={audit.error} onRetry={audit.refetch} />}
          {audit.data && <AuditTable logs={audit.data} />}
        </div>
      </Section>
    </div>
  )
}
