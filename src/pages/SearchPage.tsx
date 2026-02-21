import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearchMovies } from '@/features/search/hooks/useSearchMovies'
import { debounce } from '@/shared/lib/debounce'
import { getImageUrl } from '@/shared/api/raw/client'
import { formatYear, formatRating } from '@/shared/lib/formatters'
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton'
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
    (e: React.FormEvent) => {
      e.preventDefault()
      setSearchParams(inputValue.trim() ? { q: inputValue.trim() } : {})
    },
    [inputValue, setSearchParams]
  )

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-brown-200 bg-white p-8 text-center shadow-sm">
          <p className="text-stone-700">載入電影失敗：{error?.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-lavender-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lavender-600"
          >
            重試
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <form onSubmit={handleSearchSubmit} className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={inputValue}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="搜尋電影..."
            aria-label="搜尋電影"
            className="w-full rounded-xl border border-brown-200 bg-white px-4 py-3 text-stone-800 placeholder-stone-400 focus:border-lavender-500 focus:outline-none focus:ring-2 focus:ring-lavender-200 sm:max-w-md"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-lavender-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lavender-600"
          >
            搜尋電影
          </button>
        </div>
      </form>

      {searchKeyword.length < 2 ? (
        <div className="rounded-xl border border-brown-200 bg-white p-12 text-center">
          <p className="text-stone-600">請至少輸入 2 個字元進行搜尋</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-lavender-500 border-t-transparent" />
        </div>
      ) : movies.length === 0 ? (
        <div className="rounded-xl border border-brown-200 bg-white p-12 text-center">
          <p className="text-stone-600">無搜尋結果，請嘗試不同的搜尋詞彙。</p>
        </div>
      ) : (
        <>
          <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
              <MovieItem key={movie.id} movie={movie} />
            ))}
          </ul>
          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-xl border border-brown-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-brown-50 disabled:opacity-50"
              >
                {isFetchingNextPage ? '載入中...' : '載入更多'}
              </button>
            </div>
          )}
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
