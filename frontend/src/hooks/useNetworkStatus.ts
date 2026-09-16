import { useQuery } from '@tanstack/react-query'
import { getNetworkStatus } from '../api/network'
import { POLL } from '../constants/polling'

export const useNetworkStatus = () =>
  useQuery({ queryKey: ['network'], queryFn: getNetworkStatus, refetchInterval: POLL.network })
