import Input from '../../ui/Input'
import { useT } from '../../../i18n'

export default function ChatSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useT()
  return <Input type="search" placeholder={t('chat.search')} value={value} onChange={(e) => onChange(e.target.value)} />
}
