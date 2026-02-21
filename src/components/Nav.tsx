import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore'

export function Nav() {
  const location = useLocation()
  const { items, load } = useWatchlistStore()

  useEffect(() => {
    load()
  }, [load])

  const count = items.length

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.2)',
      }}
    >
      <Link
        to="/"
        style={{
          color: location.pathname === '/' ? '#646cff' : 'inherit',
          fontWeight: location.pathname === '/' ? 600 : 500,
        }}
      >
        搜尋電影
      </Link>
      <Link
        to="/watchlist"
        style={{
          color: location.pathname === '/watchlist' ? '#646cff' : 'inherit',
          fontWeight: location.pathname === '/watchlist' ? 600 : 500,
        }}
      >
        待看清單
        {count > 0 && (
          <span
            style={{
              marginLeft: 6,
              padding: '2px 6px',
              borderRadius: 10,
              background: '#646cff',
              fontSize: 12,
            }}
          >
            {count}
          </span>
        )}
      </Link>
    </nav>
  )
}
