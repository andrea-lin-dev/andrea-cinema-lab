import { tmdbFetch } from '@/shared/api/raw/client'
import {
  adaptSearchResults,
  adaptMovieDetail,
} from '@/shared/api/adapter/movieAdapter'
import {
  searchErrorResponse,
  searchErrorResponseObjectInsteadOfArray,
  creditsErrorResponse,
} from '@/shared/api/mocks/errorResponses'
import type { MovieSummary, MovieDetail } from '@/shared/types/domain'

const DEMO_API_ERROR = import.meta.env.VITE_DEMO_API_ERROR === 'true'

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
  if (DEMO_API_ERROR) {
    // Demo: API 回傳 array 當 root（預期 object）→ schema 會 fail
    if (page === 1) {
      return adaptSearchResults(searchErrorResponse)
    }
    // Demo: API 回傳 results 為 object（預期 array）→ schema 會 fallback 成 []
    return adaptSearchResults(searchErrorResponseObjectInsteadOfArray)
  }

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
  let detailRaw: unknown
  let creditsRaw: unknown
  let videosRaw: unknown
  let reviewsRaw: unknown

  if (DEMO_API_ERROR) {
    // Demo: 正常 detail，但 credits 回傳 array 當 root（預期 { cast, crew }）
    const [detail, credits, videos, reviews] = await Promise.all([
      tmdbFetch<unknown>(`/movie/${id}`, { signal }),
      Promise.resolve(creditsErrorResponse),
      tmdbFetch<unknown>(`/movie/${id}/videos`, { signal }),
      tmdbFetch<unknown>(`/movie/${id}/reviews`, {
        params: { page: 1 },
        signal,
      }),
    ])
    detailRaw = detail
    creditsRaw = credits
    videosRaw = videos
    reviewsRaw = reviews
  } else {
    const results = await Promise.all([
      tmdbFetch<unknown>(`/movie/${id}`, { signal }),
      tmdbFetch<unknown>(`/movie/${id}/credits`, { signal }),
      tmdbFetch<unknown>(`/movie/${id}/videos`, { signal }),
      tmdbFetch<unknown>(`/movie/${id}/reviews`, {
        params: { page: 1 },
        signal,
      }),
    ])
    ;[detailRaw, creditsRaw, videosRaw, reviewsRaw] = results
  }

  return adaptMovieDetail(detailRaw, creditsRaw, videosRaw, reviewsRaw)
}
