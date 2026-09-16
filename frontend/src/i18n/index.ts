// Chhota i18n helper. Baad me chaho to react-i18next laga sakte ho.
import en from './en.json'
import hi from './hi.json'
import { useUiStore } from '../store/uiStore'

const dict = { en, hi } as const
export type TKey = keyof typeof en

export function useT() {
  const lang = useUiStore((s) => s.lang)
  return (key: TKey) => (dict[lang] as Record<string, string>)[key] ?? en[key]
}
