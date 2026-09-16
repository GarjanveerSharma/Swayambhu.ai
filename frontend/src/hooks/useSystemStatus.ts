import { useQuery } from '@tanstack/react-query'
import { getSystemStatus } from '../api/system'
import { POLL } from '../constants/polling'

export const useSystemStatus = () =>
  useQuery({ queryKey: ['system'], queryFn: getSystemStatus, refetchInterval: POLL.system })
