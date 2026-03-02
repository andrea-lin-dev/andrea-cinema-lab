import { lazy, Suspense, useEffect, useState } from 'react'
import { getTheme, THEMES } from './index'

const ThemeToggle = lazy(() =>
  import('./ThemeToggle').then((m) => ({ default: m.ThemeToggle }))
)

/**
 * Defers ThemeToggle load until browser is idle.
 * Shows static theme label initially; swaps in interactive dropdown when loaded.
 */
export function DeferredThemeToggle() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(() => setShouldLoad(true), { timeout: 300 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(() => setShouldLoad(true), 100)
    return () => clearTimeout(id)
  }, [])

  if (!shouldLoad) {
    const theme = getTheme()
    const label = THEMES.find((t) => t.id === theme)?.label ?? '紫色 · 淡咖啡'
    return (
      <span className="text-sm text-stone-600" aria-hidden>
        主題：{label}
      </span>
    )
  }

  return (
    <Suspense
      fallback={
        <span className="text-sm text-stone-600 animate-pulse">主題：…</span>
      }
    >
      <ThemeToggle />
    </Suspense>
  )
}
