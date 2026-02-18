import { Link, useLocation } from 'react-router-dom'

export function Nav() {
  const location = useLocation()

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
        Search
      </Link>
      <Link
        to="/watchlist"
        style={{
          color: location.pathname === '/watchlist' ? '#646cff' : 'inherit',
          fontWeight: location.pathname === '/watchlist' ? 600 : 500,
        }}
      >
        Watchlist
      </Link>
    </nav>
  )
}
