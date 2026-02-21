import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore'
import { sortWatchlistItems } from '@/shared/lib/sortMovies'
import type { WatchlistSortOption } from '@/shared/types/domain'
import { getImageUrl } from '@/shared/api/raw/client'
import { formatYear, formatRating } from '@/shared/lib/formatters'
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton'

const SORT_OPTIONS: { value: WatchlistSortOption; label: string }[] = [
  { value: 'releaseDate-desc', label: '上映時間(新->舊)' },
  { value: 'rating-desc', label: '評分(高->低)' },
  { value: 'title-asc', label: '片名(A->Z)' },
  { value: 'addedAt-desc', label: '加入待看清單時間(新->舊)' },
  { value: 'addedAt-asc', label: '加入待看清單時間(舊->新)' },
]

export function WatchlistPage() {
  const { items, load } = useWatchlistStore()
  const [sortOption, setSortOption] =
    useState<WatchlistSortOption>('addedAt-desc')

  useEffect(() => {
    load()
  }, [load])

  const sortedItems = sortWatchlistItems(items, sortOption)

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>待看清單</h1>
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>
              排序:{' '}
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as WatchlistSortOption)
                }
                style={{ padding: 8, borderRadius: 6, background: '#222' }}
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
        <p style={{ color: '#888' }}>
          你的待看清單是空的。搜尋電影並將它們加入到你的觀看清單中。
        </p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 16,
          }}
        >
          {sortedItems.map(({ movie }) => (
            <li
              key={movie.id}
              style={{
                border: '1px solid #333',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <Link
                to={`/movie/${movie.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '2/3',
                    background: '#333',
                  }}
                >
                  {getImageUrl(movie.posterPath, 'w342') ? (
                    <img
                      src={getImageUrl(movie.posterPath, 'w342') ?? ''}
                      alt={movie.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                      }}
                    >
                      No poster
                    </div>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      padding: '4px 8px',
                      background: 'rgba(0,0,0,0.8)',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {formatRating(movie.voteAverage)} ★
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3
                      style={{
                        margin: '0 0 4px',
                        fontSize: 14,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {movie.title}
                    </h3>
                    {formatYear(movie.releaseDate) && (
                      <p style={{ margin: 0, fontSize: 12, color: '#888' }}>
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
    </div>
  )
}
