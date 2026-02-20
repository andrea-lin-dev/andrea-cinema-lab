import type { MovieSummary } from '@/shared/types/domain'
import { searchMoviesResponseSchema } from '@/shared/api/schema/tmdb'

const UNKNOWN = 'Unknown'

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
