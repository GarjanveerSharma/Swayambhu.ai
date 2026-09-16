import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { ACCEPTED_FILE_TYPES } from '../../constants/acceptedFileTypes'
import { useT } from '../../i18n'

export default function UploadDropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const t = useT()
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
    maxSize: 200 * 1024 * 1024,
    onDropAccepted: onFiles,
  })
  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-sm ${isDragActive ? 'border-accent bg-panel' : 'border-line'}`}
      >
        <input {...getInputProps()} />
        <Upload className="text-muted" />
        <p>{t('kb.drop')}</p>
        <p className="text-xs text-muted">PDF, DOCX, TXT, PNG, JPG, TIFF · max 200 MB</p>
      </div>
      {fileRejections.length > 0 && (
        <p className="mt-2 text-xs text-err">
          {fileRejections.map((r) => r.file.name).join(', ')}: file type ya size allowed nahi hai.
        </p>
      )}
    </div>
  )
}
