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
        aria-label={inList ? '從待看清單移除' : '加入待看清單'}
        className="shrink-0 rounded-full p-1.5 text-lg text-accent-600 transition-colors hover:bg-accent-100"
      >
        {inList ? '★' : '☆'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        inList
          ? 'border border-neutral-200 bg-neutral-50 text-stone-600 hover:bg-neutral-100'
          : 'bg-accent-500 text-white hover:bg-accent-600'
      }`}
    >
      {inList ? '已加入待看清單' : '加入待看清單'}
    </button>
  )
}
