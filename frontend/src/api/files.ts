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

  try {
    const res = await api.get('/files')
    return res.data
  } catch (err) {
    const typedErr = err as { response?: { status?: number }; request?: unknown }
    // Temporary: backend /api/files abhi nahi bana, tab tak dummy data
    if (typedErr?.response?.status === 404 || !typedErr?.response) {
      return structuredClone(db.files)
    }
    throw err
  }
}

export async function downloadFile(file: GeneratedFile) {
  if (USE_MOCKS) {
    downloadBlob(new Blob([`Mock file: ${file.name}`], { type: 'text/plain' }), file.name + '.txt')
    return
  }

  if (db.files.some((f) => f.id === file.id)) {
    downloadBlob(new Blob([`Dummy file: ${file.name}`], { type: 'text/plain' }), `${file.name}.txt`)
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

  if (db.files.some((f) => f.id === id)) {
    db.files = db.files.filter((f) => f.id !== id)
    return
  }

  await api.delete(`/files/${id}`)
}
