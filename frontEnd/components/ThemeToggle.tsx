'use client'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="ml-4 px-3 py-1 border rounded text-sm transition hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-red"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
