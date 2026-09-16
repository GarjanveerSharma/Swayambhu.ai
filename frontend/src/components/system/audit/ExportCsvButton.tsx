import { Download } from 'lucide-react'
import type { AuditLog } from '../../../types/audit'
import Button from '../../ui/Button'
import { auditToCsv } from '../../../api/audit'
import { downloadBlob } from '../../../utils/downloadBlob'

export default function ExportCsvButton({ logs }: { logs: AuditLog[] }) {
  return (
    <Button variant="secondary" disabled={logs.length === 0} onClick={() => downloadBlob(new Blob([auditToCsv(logs)], { type: 'text/csv' }), 'audit_log.csv')}>
      <Download size={14} /> Export CSV
    </Button>
  )
}
