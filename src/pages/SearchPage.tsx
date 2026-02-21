import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearchMovies } from '@/features/search/hooks/useSearchMovies'
import { debounce } from '@/shared/lib/debounce'
import { getImageUrl } from '@/shared/api/raw/client'
import { formatYear, formatRating } from '@/shared/lib/formatters'
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton'
import {
  SearchBar,
  EmptyState,
  ErrorState,
  SkeletonCard,
  InfiniteLoaderSentinel,
} from '@/shared/ui'
import type { MovieSummary } from '@/shared/types/domain'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchKeyword = searchParams.get('q') ?? ''
  const [inputValue, setInputValue] = useState(searchKeyword)

  useEffect(() => {
    const id = setTimeout(() => setInputValue(searchKeyword), 0)
    return () => clearTimeout(id)
  }, [searchKeyword])

  const debouncedSetSearch = useMemo(
    () => debounce((q: string) => setSearchParams(q ? { q } : {}), 300),
    [setSearchParams]
  )

  const {
    movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useSearchMovies(searchKeyword)

  const handleKeywordChange = useCallback(
    (val: string) => {
      setInputValue(val)
      debouncedSetSearch(val)
    },
    [debouncedSetSearch]
  )

  const handleSearchSubmit = useCallback(
    (value: string) => setSearchParams(value ? { q: value } : {}),
    [setSearchParams]
  )

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ErrorState
          title="載入電影失敗"
          message={error?.message}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <SearchBar
          value={inputValue}
          onChange={handleKeywordChange}
          onSearch={handleSearchSubmit}
          placeholder="搜尋電影..."
          submitLabel="搜尋電影"
        />
      </div>

      {searchKeyword.length < 2 ? (
        <EmptyState title="請至少輸入 2 個字元進行搜尋" />
      ) : isLoading ? (
        <ul className="grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      ) : movies.length === 0 ? (
        <EmptyState title="無搜尋結果" description="請嘗試不同的搜尋詞彙。" />
      ) : (
        <>
          <ul className="grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-3">
            {movies.map((movie) => (
              <MovieItem key={movie.id} movie={movie} />
            ))}
          </ul>
          <InfiniteLoaderSentinel
            onIntersect={() => fetchNextPage()}
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
          />
        </>
      )}
    </div>
  )
}

function MovieItem({ movie }: { movie: MovieSummary }) {
  const posterUrl = getImageUrl(movie.posterPath, 'w185')
  const year = formatYear(movie.releaseDate)

  return (
    <li className="group overflow-hidden rounded-xl border border-brown-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-brown-100">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-400">
              無海報
            </div>
          )}
          <div className="absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-lavender-600">
            ★ {formatRating(movie.voteAverage)}
          </div>
        </div>
        <div className="flex items-start justify-between gap-2 p-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-stone-800">
              {movie.title}
            </h3>
            {year && <p className="text-sm text-stone-500">{year}</p>}
          </div>
          <WatchlistButton movie={movie} variant="icon" />
        </div>
      </Link>
    </li>
  )
}
