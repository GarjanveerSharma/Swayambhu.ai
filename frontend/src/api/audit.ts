import { api } from './client'
import { db, delay } from '../mocks/db'
import type { AuditLog } from '../types/audit'

export async function listAuditLogs(from?: string, to?: string): Promise<AuditLog[]> {
  if (false) {
    await delay()
    return db.audit.filter((l) => (!from || l.time >= from) && (!to || l.time <= to + 'T23:59:59Z'))
  }
  return (await api.get('/audit', { params: { from, to } })).data
}

export function auditToCsv(logs: AuditLog[]) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = logs.map((l) => [l.time, l.query, l.model, l.tools.join('|'), l.file ?? ''].map(esc).join(','))
  return ['time,query,model,tools,file', ...rows].join('\n')
}
