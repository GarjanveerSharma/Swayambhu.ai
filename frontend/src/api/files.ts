import { api } from './client'
import { USE_MOCKS } from '../constants/config'
import { db, delay } from '../mocks/db'
import type { GeneratedFile } from '../types/file'
import { downloadBlob } from '../utils/downloadBlob'

export async function listFiles(): Promise<GeneratedFile[]> {
  if (USE_MOCKS) {
    await delay()
    return structuredClone(db.files)
  }
  return (await api.get('/files')).data
}

export async function downloadFile(file: GeneratedFile) {
  if (USE_MOCKS) {
    downloadBlob(new Blob([`Mock file: ${file.name}`], { type: 'text/plain' }), file.name + '.txt')
    return
  }
  const res = await api.get(`/files/${file.id}`, { responseType: 'blob' })
  downloadBlob(res.data, file.name)
}

export async function deleteFile(id: string) {
  if (USE_MOCKS) {
    db.files = db.files.filter((f) => f.id !== id)
    return
  }
  await api.delete(`/files/${id}`)
}
