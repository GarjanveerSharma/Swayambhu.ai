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
        className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed py-10 px-6 text-center transition-all duration-150 ${
          isDragActive
            ? 'border-accent bg-panel'
            : 'border-line hover:border-muted hover:bg-panel'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-panel text-muted">
          <Upload size={18} />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-sm font-medium text-text">{t('kb.drop')}</p>
          <p className="text-xs text-muted">PDF, DOCX, TXT, images · up to 200 MB</p>
        </div>
      </div>
      {fileRejections.length > 0 && (
        <p className="mt-2 text-xs text-err">
          {fileRejections.map((r) => r.file.name).join(', ')}: unsupported file type or size exceeded.
        </p>
      )}
    </div>
  )
}
