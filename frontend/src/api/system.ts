import { api } from './client'
import { db, delay } from '../mocks/db'
import type { SystemStatus } from '../types/system'

export async function getSystemStatus(): Promise<SystemStatus> {
  if (false) {
    await delay(200)
    const s = structuredClone(db.system)
    s.resources.ramUsedGb = +(20 + Math.random() * 3).toFixed(1)
    s.resources.gpuUsedGb = +(9 + Math.random() * 1.5).toFixed(1)
    return s
  }

  return (await api.get('/system/status')).data
}
