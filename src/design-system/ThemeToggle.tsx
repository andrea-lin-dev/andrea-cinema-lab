import { useSyncExternalStore } from 'react'
import { getTheme, setTheme, THEMES, type ThemeId } from './index'

function subscribe(cb: () => void) {
  const handler = () => cb()
  window.addEventListener('themechange', handler)
  return () => window.removeEventListener('themechange', handler)
}

function getSnapshot() {
  return getTheme()
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return (
    <label htmlFor="theme-toggle" className="flex items-center gap-2">
      <span className="sr-only">主題</span>
      <select
        id="theme-toggle"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeId)}
        className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs text-stone-600 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 sm:text-sm"
        aria-label="切換主題"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  )
}
