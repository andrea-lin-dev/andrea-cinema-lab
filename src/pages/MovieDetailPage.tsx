import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMovieDetailBundle } from '@/shared/api/services/movieService'
import { getImageUrl } from '@/shared/api/raw/client'
import {
  formatRuntime,
  formatYear,
  formatRating,
} from '@/shared/lib/formatters'

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const movieId = id ? parseInt(id, 10) : NaN

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetailBundle(movieId),
    enabled: !Number.isNaN(movieId),
  })

  if (Number.isNaN(movieId)) {
    return (
      <div style={{ padding: 24 }}>
        <p>無效的電影 ID。</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <p>載入電影失敗：{error?.message}</p>
        <button type="button" onClick={() => refetch()}>
          重試
        </button>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div style={{ padding: 24 }}>
        <p>載入中...</p>
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
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ marginBottom: 24, position: 'relative' }}>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            style={{
              width: '100%',
              aspectRatio: '16/9',
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 16,
            alignItems: 'flex-end',
          }}
        >
          {posterUrl && (
            <img
              src={posterUrl}
              alt={detail.title}
              style={{
                width: 120,
                height: 180,
                objectFit: 'cover',
                borderRadius: 8,
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>{detail.title}</h1>
            {detail.tagline && (
              <p
                style={{
                  margin: '0 0 8px',
                  fontStyle: 'italic',
                  color: '#888',
                }}
              >
                {detail.tagline}
              </p>
            )}
            <div
              style={{ display: 'flex', gap: 16, color: '#888', fontSize: 14 }}
            >
              {formatYear(detail.releaseDate) && (
                <span>{formatYear(detail.releaseDate)}</span>
              )}
              {detail.runtime && <span>{formatRuntime(detail.runtime)}</span>}
              <span>★ {formatRating(detail.voteAverage)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gap: 24 }}>
        <div>
          {detail.overview && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>劇情簡介</h2>
              <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>
                {detail.overview}
              </p>
            </section>
          )}

          {detail.genres.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>類型</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {detail.genres.map((g) => (
                  <span
                    key={g.id}
                    style={{
                      padding: '4px 12px',
                      background: '#333',
                      borderRadius: 16,
                      fontSize: 14,
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section style={{ marginBottom: 24 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>預告片</h2>
            {trailerUrl ? (
              <div
                style={{
                  aspectRatio: '16/9',
                  overflow: 'hidden',
                  borderRadius: 8,
                }}
              >
                <iframe
                  src={trailerUrl}
                  title="預告片"
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allowFullScreen
                />
              </div>
            ) : (
              <p style={{ color: '#888' }}>尚無預告片。</p>
            )}
          </section>

          {detail.reviews.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>影評</h2>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {detail.reviews.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: 16,
                      background: '#222',
                      borderRadius: 8,
                    }}
                  >
                    <p style={{ margin: '0 0 4px', fontWeight: 600 }}>
                      {r.author}
                    </p>
                    {r.rating != null && (
                      <p
                        style={{
                          margin: '0 0 8px',
                          fontSize: 14,
                          color: '#aaa',
                        }}
                      >
                        {r.rating}/10
                      </p>
                    )}
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        color: '#888',
                        lineHeight: 1.5,
                      }}
                    >
                      {r.content.slice(0, 300)}
                      {r.content.length > 300 ? '...' : ''}
                    </p>
                  </div>
                ))}
                {detail.reviews.length > 3 && (
                  <p style={{ color: '#666', fontSize: 14 }}>
                    還有 {detail.reviews.length - 3} 則影評
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        <div>
          {detail.cast.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>演員</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {detail.cast.slice(0, 15).map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {c.profilePath ? (
                      <img
                        src={getImageUrl(c.profilePath, 'w92') ?? ''}
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: '#333',
                        }}
                      />
                    )}
                    <div>
                      <p style={{ margin: 0, fontWeight: 500 }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: 14, color: '#888' }}>
                        {c.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {detail.crew.length > 0 && (
            <section>
              <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>導演</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {detail.crew.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {c.profilePath ? (
                      <img
                        src={getImageUrl(c.profilePath, 'w92') ?? ''}
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: '#333',
                        }}
                      />
                    )}
                    <p style={{ margin: 0, fontWeight: 500 }}>{c.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <Link to="/" style={{ color: '#646cff', textDecoration: 'none' }}>
          ← 返回搜尋電影
        </Link>
      </div>
    </div>
  )
}
