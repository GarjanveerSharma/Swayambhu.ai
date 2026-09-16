import { File, FileSpreadsheet, FileText, FileImage, Presentation } from 'lucide-react'

export function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['xlsx', 'xls', 'csv'].includes(ext)) return FileSpreadsheet
  if (['pptx', 'ppt'].includes(ext)) return Presentation
  if (['png', 'jpg', 'jpeg', 'tif', 'tiff'].includes(ext)) return FileImage
  if (['pdf', 'docx', 'doc', 'txt'].includes(ext)) return FileText
  return File
}
