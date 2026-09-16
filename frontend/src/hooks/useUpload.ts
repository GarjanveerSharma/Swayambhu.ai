import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { uploadDocument } from '../api/documents'
import { useUiStore } from '../store/uiStore'
import { uid } from '../utils/id'

export interface UploadItem {
  id: string
  name: string
  progress: number
  error?: string
}

export function useUpload() {
  const [items, setItems] = useState<UploadItem[]>([])
  const qc = useQueryClient()
  const toast = useUiStore((s) => s.toast)

  const patch = (id: string, p: Partial<UploadItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)))

  const upload = async (files: File[]) => {
    const batch = files.map((f) => ({ id: uid(), name: f.name, progress: 0, file: f }))
    setItems((prev) => [...batch.map(({ file: _f, ...rest }) => rest), ...prev])
    await Promise.all(
      batch.map(async (b) => {
        try {
          await uploadDocument(b.file, (progress) => patch(b.id, { progress }))
          patch(b.id, { progress: 100 })
          qc.invalidateQueries({ queryKey: ['documents'] })
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Upload failed'
          patch(b.id, { error: msg })
          toast(`${b.name}: ${msg}`, 'error')
        }
      }),
    )
    toast(`${files.length} file upload hui, processing shuru`)
    setTimeout(() => setItems((prev) => prev.filter((i) => i.error)), 2000)
  }

  return { items, upload }
}
