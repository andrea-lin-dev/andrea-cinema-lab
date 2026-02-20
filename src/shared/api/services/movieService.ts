import { tmdbFetch } from '@/shared/api/raw/client'
import { adaptSearchResults } from '@/shared/api/adapter/movieAdapter'
import type { MovieSummary } from '@/shared/types/domain'

export interface SearchResult {
  movies: MovieSummary[]
  page: number
  totalPages: number
  totalResults: number
  schemaErrors: string[]
}

export async function searchMovies(
  keyword: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<SearchResult> {
  const raw = await tmdbFetch<unknown>('/search/movie', {
    params: { query: keyword, page },
    signal,
  })
  return adaptSearchResults(raw)
}
