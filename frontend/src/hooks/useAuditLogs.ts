import { useQuery } from '@tanstack/react-query'
import { listAuditLogs } from '../api/audit'

export const useAuditLogs = (from: string, to: string) =>
  useQuery({ queryKey: ['audit', from, to], queryFn: () => listAuditLogs(from || undefined, to || undefined) })
