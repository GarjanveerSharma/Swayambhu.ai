import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose }: {
  open: boolean; title: string; message: string; confirmLabel?: string; onConfirm: () => void; onClose: () => void
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="mb-4 text-sm text-muted">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}
