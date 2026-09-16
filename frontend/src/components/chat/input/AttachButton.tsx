import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Paperclip } from 'lucide-react'
import IconButton from '../../ui/IconButton'
import { ACCEPT_ATTR } from '../../../constants/acceptedFileTypes'
import { useAttachmentStore } from '../../../store/attachmentStore'
import { uploadDocument } from '../../../api/documents'
import { useUiStore } from '../../../store/uiStore'
import { uid } from '../../../utils/id'

// Chat me attach ki gayi file bhi /api/upload se jaati hai (knowledge base me bhi add ho jaati hai)
export default function AttachButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { add, update, remove } = useAttachmentStore()
  const toast = useUiStore((s) => s.toast)
  const qc = useQueryClient()

  const onFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(async (file) => {
      const localId = uid()
      add({ id: localId, name: file.name, uploading: true })
      try {
        const doc = await uploadDocument(file, () => {})
        update(localId, { id: doc.id, uploading: false })
        qc.invalidateQueries({ queryKey: ['documents'] })
      } catch (e) {
        remove(localId)
        toast(`${file.name}: ${e instanceof Error ? e.message : 'upload failed'}`, 'error')
      }
    })
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <IconButton label="Attach file" onClick={() => inputRef.current?.click()}>
        <Paperclip size={18} />
      </IconButton>
      <input ref={inputRef} type="file" multiple accept={ACCEPT_ATTR} hidden onChange={(e) => onFiles(e.target.files)} />
    </>
  )
}
