import { Moon, Sun } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import IconButton from '../ui/IconButton'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUiStore()
  return (
    <IconButton label="Toggle theme" onClick={toggleTheme}>
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </IconButton>
  )
}
