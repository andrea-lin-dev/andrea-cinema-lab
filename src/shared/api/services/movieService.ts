import { tmdbFetch } from '@/shared/api/raw/client'
import {
  adaptSearchResults,
  adaptMovieDetail,
} from '@/shared/api/adapter/movieAdapter'
import type { MovieSummary, MovieDetail } from '@/shared/types/domain'

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

export interface MovieDetailResult {
  detail: MovieDetail
  schemaErrors: string[]
}

export async function getMovieDetailBundle(
  id: number,
  signal?: AbortSignal
): Promise<MovieDetailResult> {
  const [detailRaw, creditsRaw, videosRaw, reviewsRaw] = await Promise.all([
    tmdbFetch<unknown>(`/movie/${id}`, { signal }),
    tmdbFetch<unknown>(`/movie/${id}/credits`, { signal }),
    tmdbFetch<unknown>(`/movie/${id}/videos`, { signal }),
    tmdbFetch<unknown>(`/movie/${id}/reviews`, {
      params: { page: 1 },
      signal,
    }),
  ])

  return adaptMovieDetail(detailRaw, creditsRaw, videosRaw, reviewsRaw)
}
