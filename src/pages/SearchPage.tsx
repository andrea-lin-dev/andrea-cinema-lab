import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearchMovies } from '@/features/search/hooks/useSearchMovies'
import { debounce } from '@/shared/lib/debounce'
import { getImageUrl } from '@/shared/api/raw/client'
import { formatYear, formatRating } from '@/shared/lib/formatters'
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
      <div style={{ padding: 24 }}>
        <p>Failed to load movies: {error?.message}</p>
        <button type="button" onClick={() => refetch()}>
          重試
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 24 }}>
        <input
          type="search"
          value={inputValue}
          onChange={(e) => handleKeywordChange(e.target.value)}
          placeholder="搜尋電影..."
          aria-label="搜尋電影"
          style={{ padding: 8, width: 300, marginRight: 8 }}
        />
        <button type="submit">搜尋</button>
      </form>

      {searchKeyword.length < 2 ? (
        <p>請至少輸入2個字元進行搜尋</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : movies.length === 0 ? (
        <p>無搜尋結果，請嘗試不同的搜尋詞彙。</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {movies.map((movie) => (
              <MovieItem key={movie.id} movie={movie} />
            ))}
          </ul>
          {hasNextPage && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              style={{ marginTop: 16 }}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
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
    <li
      style={{
        display: 'flex',
        gap: 16,
        marginBottom: 16,
        padding: 12,
        border: '1px solid #333',
      }}
    >
      <Link
        to={`/movie/${movie.id}`}
        style={{
          display: 'flex',
          gap: 16,
          flex: 1,
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            style={{ width: 92, height: 138, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: 92,
              height: 138,
              background: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No poster
          </div>
        )}
        <div>
          <h3 style={{ margin: '0 0 4px' }}>{movie.title}</h3>
          {year && <p style={{ margin: 0, color: '#888' }}>{year}</p>}
          <p style={{ margin: '4px 0', color: '#aaa' }}>
            ★ {formatRating(movie.voteAverage)}
          </p>
          {movie.overview && (
            <p style={{ margin: 8, fontSize: 14, maxWidth: 400 }}>
              {movie.overview.slice(0, 150)}...
            </p>
          )}
        </div>
      </Link>
    </li>
  )
}
