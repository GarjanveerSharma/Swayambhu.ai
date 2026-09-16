import { api } from './client'
import { USE_MOCKS } from '../constants/config'
import { db, delay } from '../mocks/db'
import type { NetworkStatus } from '../types/network'

export async function getNetworkStatus(): Promise<NetworkStatus> {
  if (USE_MOCKS) {
    await delay(150)
    const now = Date.now()
    const history = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(now - (19 - i) * 30000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      outbound: 0,
    }))
    return { outbound: 0, airGapped: true, connections: db.connections, history }
  }
  return (await api.get('/network/status')).data
}
