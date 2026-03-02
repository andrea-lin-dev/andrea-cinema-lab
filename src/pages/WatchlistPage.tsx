import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore'
import { sortWatchlistItems } from '@/shared/lib/sortMovies'
import type { WatchlistSortOption } from '@/shared/types/domain'
import { getImageUrl } from '@/shared/api/raw/client'
import { formatYear, formatRating } from '@/shared/lib/formatters'
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton'
import { LotteryModal } from '@/features/lottery/components/LotteryModal'
import { EmptyState } from '@/shared/ui'
import { ThemeToggle } from '@/design-system/ThemeToggle'

const SORT_OPTIONS: { value: WatchlistSortOption; label: string }[] = [
  { value: 'addedAt-desc', label: '加入時間（新→舊）' },
  { value: 'addedAt-asc', label: '加入時間（舊→新）' },
  { value: 'releaseDate-desc', label: '上映時間（新→舊）' },
  { value: 'rating-desc', label: '評分（高→低）' },
  { value: 'title-asc', label: '片名（A→Z）' },
]

export function WatchlistPage() {
  const { items, load } = useWatchlistStore()
  const [sortOption, setSortOption] =
    useState<WatchlistSortOption>('addedAt-desc')
  const [isLotteryOpen, setIsLotteryOpen] = useState(false)

  useEffect(() => {
    load()
  }, [load])

  const sortedItems = sortWatchlistItems(items, sortOption)
  const movies = items.map((i) => i.movie)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-800">待看清單</h1>
        {items.length > 0 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={() => setIsLotteryOpen(true)}
              className="rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700"
            >
              🍿 今晚看什麼？抽籤
            </button>
            <ThemeToggle />
            <label htmlFor="watchlist-sort" className="flex items-center gap-2">
              <span className="text-sm text-stone-600">排序：</span>
              <select
                id="watchlist-sort"
                name="watchlist-sort"
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as WatchlistSortOption)
                }
                className="rounded-lg border border-neutral-200 bg-white px-2 py-2 text-sm text-stone-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="待看清單是空的"
          description="搜尋電影並將它們加入到你的觀看清單中。"
        />
      ) : (
        <ul className="grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {sortedItems.map(({ movie }) => (
            <li
              key={movie.id}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <Link to={`/movie/${movie.id}`} className="block">
                <div className="relative aspect-[2/3] overflow-hidden bg-neutral-100">
                  {getImageUrl(movie.posterPath, 'w342') ? (
                    <img
                      src={getImageUrl(movie.posterPath, 'w342') ?? ''}
                      alt={movie.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-400">
                      無海報
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-accent-600">
                    {formatRating(movie.voteAverage)} ★
                  </div>
                </div>
                <div className="flex items-start justify-between gap-2 p-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-stone-800">
                      {movie.title}
                    </h3>
                    {formatYear(movie.releaseDate) && (
                      <p className="text-sm text-stone-500">
                        {formatYear(movie.releaseDate)}
                      </p>
                    )}
                  </div>
                  <WatchlistButton movie={movie} variant="icon" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <LotteryModal
        isOpen={isLotteryOpen}
        onClose={() => setIsLotteryOpen(false)}
        movies={movies}
      />
    </div>
  )
}
