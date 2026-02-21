import { useWatchlistStore } from '../store/watchlistStore'
import type { MovieSummary } from '@/shared/types/domain'

interface WatchlistButtonProps {
  movie: MovieSummary
  variant?: 'button' | 'icon'
}

export function WatchlistButton({
  movie,
  variant = 'button',
}: WatchlistButtonProps) {
  const { has, add, remove } = useWatchlistStore()
  const inList = has(movie.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inList) {
      remove(movie.id)
    } else {
      add(movie)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          fontSize: 18,
        }}
      >
        {inList ? '★' : '☆'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        border: '1px solid #333',
        background: inList ? '#333' : '#646cff',
        color: inList ? '#ccc' : '#fff',
        cursor: 'pointer',
        fontSize: 14,
      }}
    >
      {inList ? '已加入待看清單' : '加入待看清單'}
    </button>
  )
}
