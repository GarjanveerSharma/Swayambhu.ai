import { api } from './client'
import { USE_MOCKS } from '../constants/config'
import { db, delay } from '../mocks/db'
import type { Document } from '../types/document'
import { uid } from '../utils/id'

export async function listDocuments(): Promise<Document[]> {
  if (USE_MOCKS) {
    await delay(200)
    return structuredClone(db.documents)
  }
  return (await api.get('/documents')).data
}

export async function uploadDocument(file: File, onProgress: (pct: number) => void): Promise<Document> {
  if (USE_MOCKS) {
    for (let p = 0; p <= 100; p += 20) {
      onProgress(p)
      await delay(150)
    }
    const doc: Document = {
      id: uid(), name: file.name, type: file.name.split('.').pop() ?? '', size: file.size,
      pages: null, uploadedAt: new Date().toISOString(), status: 'processing',
    }
    db.documents.unshift(doc)
    // 4 second baad "ready" ho jayega (fake processing)
    setTimeout(() => {
      const d = db.documents.find((x) => x.id === doc.id)
      if (d) { d.status = 'ready'; d.pages = Math.ceil(file.size / 50000) || 1 }
    }, 4000)
    return doc
  }
  const form = new FormData()
  form.append('file', file)
  const res = await api.post('/upload', form, {
    onUploadProgress: (e) => e.total && onProgress(Math.round((e.loaded / e.total) * 100)),
  })
  return res.data
}

export async function deleteDocument(id: string) {
  if (USE_MOCKS) {
    db.documents = db.documents.filter((d) => d.id !== id)
    return
  }
  await api.delete(`/documents/${id}`)
}

export async function getDocumentPreview(id: string): Promise<string> {
  if (USE_MOCKS) {
    await delay()
    const d = db.documents.find((x) => x.id === id)
    return `--- ${d?.name} (extracted text, page 1) ---\n\nCentrifugal pump P-101 shall be serviced every 500 running hours or quarterly, whichever is earlier.\nBearings must be greased with lithium-based grease...\n\n(Mock preview)`
  }
  return (await api.get(`/documents/${id}/preview`)).data.text
}
