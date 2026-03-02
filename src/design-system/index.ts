/**
 * Design System
 *
 * Token roles:
 * - accent: primary/brand (buttons, links, active states)
 * - neutral: background, borders, surfaces
 * - stone: text (from Tailwind, shared across themes)
 */

export type ThemeId = 'lavender' | 'morandi'

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'lavender', label: '紫色 · 淡咖啡' },
  { id: 'morandi', label: '莫蘭迪綠 · 淡灰' },
]

const THEME_STORAGE_KEY = 'theme'

export function setTheme(themeId: ThemeId) {
  document.documentElement.setAttribute('data-theme', themeId)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: themeId }))
}

export function getTheme(): ThemeId {
  if (typeof document === 'undefined') return 'lavender'
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null
  if (stored && THEMES.some((t) => t.id === stored)) return stored
  return (
    (document.documentElement.getAttribute('data-theme') as ThemeId | null) ??
    'lavender'
  )
}
