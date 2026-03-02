import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMovieDetailBundle } from '@/shared/api/services/movieService'
import { getImageUrl } from '@/shared/api/raw/client'
import {
  formatRuntime,
  formatYear,
  formatRating,
} from '@/shared/lib/formatters'
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton'
import { ErrorState } from '@/shared/ui'

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const movieId = id ? parseInt(id, 10) : NaN

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: ({ signal }) => getMovieDetailBundle(movieId, signal),
    enabled: !Number.isNaN(movieId),
  })

  if (Number.isNaN(movieId)) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ErrorState title="無效的電影 ID" message="請檢查網址是否正確。" />
      </div>
    )
  }

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

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="aspect-video w-full rounded-xl bg-neutral-100" />
          <div className="h-8 w-1/3 rounded bg-neutral-100" />
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
        </div>
      </div>
    )
  }

  const { detail } = data
  const backdropUrl = getImageUrl(detail.backdropPath, 'w1280', 'backdrop')
  const posterUrl = getImageUrl(detail.posterPath, 'w500')
  const trailerUrl = detail.trailer
    ? `https://www.youtube.com/embed/${detail.trailer.key}?autoplay=0`
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-2xl">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            className="aspect-video w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:p-6">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={detail.title}
              className="hidden h-36 w-24 shrink-0 rounded-lg object-cover shadow-xl sm:block sm:h-48 sm:w-32"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
              {detail.title}
            </h1>
            {detail.tagline && (
              <p className="mt-1 text-base italic text-stone-600 sm:text-lg">
                {detail.tagline}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-stone-500">
              {formatYear(detail.releaseDate) && (
                <span>{formatYear(detail.releaseDate)}</span>
              )}
              {detail.runtime && <span>{formatRuntime(detail.runtime)}</span>}
              <span>★ {formatRating(detail.voteAverage)}</span>
            </div>
            <div className="mt-4">
              <WatchlistButton movie={detail} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {detail.overview && (
            <section>
              <h2 className="mb-2 text-xl font-semibold text-stone-800">
                劇情簡介
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {detail.overview}
              </p>
            </section>
          )}

          {detail.genres.length > 0 && (
            <section>
              <h2 className="mb-2 text-xl font-semibold text-stone-800">
                類型
              </h2>
              <div className="flex flex-wrap gap-2">
                {detail.genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full bg-accent-100 px-3 py-1 text-sm text-accent-600"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-2 text-xl font-semibold text-stone-800">
              預告片
            </h2>
            {trailerUrl ? (
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={trailerUrl}
                  title="預告片"
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-stone-500">
                尚無預告片。
              </p>
            )}
          </section>

          {detail.reviews.length > 0 && (
            <section>
              <h2 className="mb-2 text-xl font-semibold text-stone-800">
                影評
              </h2>
              <div className="space-y-4">
                {detail.reviews.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-neutral-200 bg-white p-4"
                  >
                    <p className="font-medium text-stone-800">{r.author}</p>
                    {r.rating != null && (
                      <p className="text-sm text-accent-600">{r.rating}/10</p>
                    )}
                    <p className="mt-2 line-clamp-4 text-sm text-stone-600">
                      {r.content}
                    </p>
                  </div>
                ))}
                {detail.reviews.length > 3 && (
                  <p className="text-sm text-stone-500">
                    還有 {detail.reviews.length - 3} 則影評
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {detail.cast.length > 0 && (
            <section>
              <h2 className="mb-2 text-xl font-semibold text-stone-800">
                演員
              </h2>
              <div className="space-y-2">
                {detail.cast.slice(0, 15).map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    {c.profilePath ? (
                      <img
                        src={getImageUrl(c.profilePath, 'w92') ?? ''}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-neutral-200" />
                    )}
                    <div>
                      <p className="font-medium text-stone-800">{c.name}</p>
                      <p className="text-sm text-stone-500">{c.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {detail.crew.length > 0 && (
            <section>
              <h2 className="mb-2 text-xl font-semibold text-stone-800">
                導演
              </h2>
              <div className="space-y-2">
                {detail.crew.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    {c.profilePath ? (
                      <img
                        src={getImageUrl(c.profilePath, 'w92') ?? ''}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-neutral-200" />
                    )}
                    <p className="font-medium text-stone-800">{c.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-accent-600 transition-colors hover:text-accent-500"
        >
          ← 返回搜尋電影
        </Link>
      </div>
    </div>
  )
}
