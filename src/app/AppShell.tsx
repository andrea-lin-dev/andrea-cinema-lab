import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()
  const { items, load } = useWatchlistStore()

  useEffect(() => {
    load()
  }, [load])

  const count = items.length

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-base font-bold text-accent-600 hover:text-accent-500 sm:text-xl"
          >
            Andrea's Cinema Lab
          </Link>
          <nav className="flex items-center gap-2 sm:gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors sm:text-base ${
                location.pathname === '/'
                  ? 'text-accent-600'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              搜尋電影
            </Link>
            <Link
              to="/watchlist"
              className={`relative flex items-center gap-2 text-sm font-medium transition-colors sm:text-base ${
                location.pathname === '/watchlist'
                  ? 'text-accent-600'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              待看清單
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1.5 text-xs font-medium text-white">
                  {count}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-neutral-200 py-4 text-center text-sm text-stone-600">
        <p>Powered by TMDB. Data © The Movie Database.</p>
      </footer>
    </div>
  )
}
