import type {
  MovieSummary,
  MovieDetail,
  CastMember,
  CrewMember,
  Trailer,
  Review,
} from '@/shared/types/domain'
import {
  searchMoviesResponseSchema,
  movieDetailSchema,
  creditsSchema,
  videosResponseSchema,
  reviewsResponseSchema,
} from '@/shared/api/schema/tmdb'

const UNKNOWN = 'Unknown'

function ensureArray<T>(
  val: unknown,
  itemParser: (x: unknown) => T | null
): T[] {
  if (Array.isArray(val)) {
    return val.map(itemParser).filter((x): x is T => x != null)
  }
  if (val && typeof val === 'object') {
    return []
  }
  return []
}

function adaptCastMember(raw: unknown): CastMember | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = typeof o.id === 'number' ? o.id : 0
  const name = typeof o.name === 'string' ? o.name : UNKNOWN
  const character = typeof o.character === 'string' ? o.character : ''
  const profilePath =
    typeof o.profile_path === 'string'
      ? o.profile_path
      : o.profile_path === null
        ? null
        : null
  return { id, name, character, profilePath }
}

function adaptCrewMember(raw: unknown): CrewMember | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = typeof o.id === 'number' ? o.id : 0
  const name = typeof o.name === 'string' ? o.name : UNKNOWN
  const job = typeof o.job === 'string' ? o.job : ''
  const profilePath =
    typeof o.profile_path === 'string'
      ? o.profile_path
      : o.profile_path === null
        ? null
        : null
  return { id, name, job, profilePath }
}

function adaptCredits(raw: unknown): {
  cast: CastMember[]
  crew: CrewMember[]
} {
  const parsed = creditsSchema.safeParse(raw)
  if (parsed.success) {
    const cast = parsed.data.cast.slice(0, 20).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path,
    }))
    const crew = parsed.data.crew
      .filter((c) => c.job === 'Director')
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        name: c.name,
        job: c.job,
        profilePath: c.profile_path,
      }))
    return { cast, crew }
  }
  const rawObj = raw as { cast?: unknown; crew?: unknown }
  return {
    cast: ensureArray(rawObj?.cast, adaptCastMember).slice(0, 20),
    crew: ensureArray(rawObj?.crew, adaptCrewMember)
      .filter((c) => c.job === 'Director')
      .slice(0, 5),
  }
}

function adaptVideos(raw: unknown): Trailer | null {
  const parsed = videosResponseSchema.safeParse(raw)
  if (parsed.success) {
    const trailer = parsed.data.results.find(
      (v) =>
        v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    )
    if (trailer) {
      return {
        id: trailer.id,
        key: trailer.key,
        name: trailer.name,
        site: trailer.site,
        type: trailer.type,
      }
    }
  }
  const rawObj = raw as { results?: unknown[] }
  const results = Array.isArray(rawObj?.results) ? rawObj.results : []
  const t = results.find((v: unknown) => {
    const o = v as { site?: string; type?: string }
    return (
      o?.site === 'YouTube' && (o?.type === 'Trailer' || o?.type === 'Teaser')
    )
  })
  if (t && typeof t === 'object' && 'key' in t) {
    return {
      id: String((t as { id?: unknown }).id ?? ''),
      key: String((t as { key?: unknown }).key ?? ''),
      name: String((t as { name?: unknown }).name ?? 'Trailer'),
      site: 'YouTube',
      type: 'Trailer',
    }
  }
  return null
}

function adaptReviews(raw: unknown): Review[] {
  const parsed = reviewsResponseSchema.safeParse(raw)
  if (parsed.success) {
    return parsed.data.results.slice(0, 10).map((r) => ({
      id: r.id,
      author: r.author,
      content: r.content,
      rating: r.author_details,
      createdAt: r.created_at,
    }))
  }
  const rawObj = raw as { results?: unknown[] }
  const results = Array.isArray(rawObj?.results) ? rawObj.results : []
  return results.slice(0, 10).map((r: unknown) => {
    const o = r as Record<string, unknown>
    return {
      id: String(o?.id ?? ''),
      author: String(o?.author ?? 'Anonymous'),
      content: String(o?.content ?? ''),
      rating:
        typeof o?.author_details === 'object' &&
        o.author_details &&
        'rating' in o.author_details
          ? (o.author_details as { rating: number | null }).rating
          : null,
      createdAt: String(o?.created_at ?? ''),
    }
  })
}

export function adaptSearchResults(raw: unknown): {
  movies: MovieSummary[]
  page: number
  totalPages: number
  totalResults: number
  schemaErrors: string[]
} {
  const schemaErrors: string[] = []
  try {
    const parsed = searchMoviesResponseSchema.safeParse(raw)
    if (parsed.success) {
      const results = parsed.data.results as Array<{
        id: number
        title: string
        poster_path: string | null
        release_date: string | null
        vote_average: number
        overview: string
      }>
      const movies: MovieSummary[] = results.map((r) => ({
        id: r.id,
        title: r.title ?? UNKNOWN,
        posterPath: r.poster_path ?? null,
        releaseDate: r.release_date ?? null,
        voteAverage: r.vote_average ?? 0,
        overview: r.overview ?? '',
      }))
      return {
        movies,
        page: (raw as { page?: number })?.page ?? 1,
        totalPages: (raw as { total_pages?: number })?.total_pages ?? 0,
        totalResults: (raw as { total_results?: number })?.total_results ?? 0,
        schemaErrors,
      }
    }
    schemaErrors.push(parsed.error.message)
  } catch (e) {
    schemaErrors.push(e instanceof Error ? e.message : 'Unknown parse error')
  }

  return {
    movies: [],
    page: 1,
    totalPages: 0,
    totalResults: 0,
    schemaErrors,
  }
}

export interface MovieDetailBundle {
  detail: MovieDetail
  schemaErrors: string[]
}

export function adaptMovieDetail(
  detailRaw: unknown,
  creditsRaw: unknown,
  videosRaw: unknown,
  reviewsRaw: unknown
): MovieDetailBundle {
  const schemaErrors: string[] = []

  const detailParsed = movieDetailSchema.safeParse(detailRaw)
  const base = detailParsed.success
    ? {
        id: detailParsed.data.id,
        title: detailParsed.data.title,
        posterPath: detailParsed.data.poster_path,
        releaseDate: detailParsed.data.release_date,
        voteAverage: detailParsed.data.vote_average,
        overview: detailParsed.data.overview,
        tagline: detailParsed.data.tagline,
        runtime: detailParsed.data.runtime,
        genres: detailParsed.data.genres,
        backdropPath: detailParsed.data.backdrop_path,
      }
    : (() => {
        schemaErrors.push('Movie detail schema failed')
        const d = detailRaw as Record<string, unknown>
        return {
          id: typeof d?.id === 'number' ? d.id : 0,
          title: typeof d?.title === 'string' ? d.title : UNKNOWN,
          posterPath:
            typeof d?.poster_path === 'string' || d?.poster_path === null
              ? d.poster_path
              : null,
          releaseDate:
            typeof d?.release_date === 'string' || d?.release_date === null
              ? d.release_date
              : null,
          voteAverage: typeof d?.vote_average === 'number' ? d.vote_average : 0,
          overview: typeof d?.overview === 'string' ? d.overview : '',
          tagline:
            typeof d?.tagline === 'string' || d?.tagline === null
              ? d.tagline
              : null,
          runtime:
            typeof d?.runtime === 'number' || d?.runtime === null
              ? d.runtime
              : null,
          genres: Array.isArray(d?.genres) ? d.genres : [],
          backdropPath:
            typeof d?.backdrop_path === 'string' || d?.backdrop_path === null
              ? d.backdrop_path
              : null,
        }
      })()

  const { cast, crew } = adaptCredits(creditsRaw)
  const trailer = adaptVideos(videosRaw)
  const reviews = adaptReviews(reviewsRaw)

  const detail: MovieDetail = {
    ...base,
    cast,
    crew,
    trailer,
    reviews,
  }

  return { detail, schemaErrors }
}
