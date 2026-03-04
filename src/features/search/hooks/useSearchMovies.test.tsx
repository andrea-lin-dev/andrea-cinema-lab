/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useSearchMovies } from './useSearchMovies'
import * as movieService from '@/shared/api/services/movieService'
import type { MovieSummary } from '@/shared/types/domain'

function createMovie(id: number, title: string): MovieSummary {
  return {
    id,
    title,
    posterPath: null,
    releaseDate: '2024-01-01',
    voteAverage: 8,
    overview: '',
  }
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useSearchMovies', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('does not fetch when keyword has less than 2 characters', async () => {
    const spy = vi.spyOn(movieService, 'searchMovies')
    const { result } = renderHook(() => useSearchMovies('a'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.fetchStatus).toBe('idle')
    expect(spy).not.toHaveBeenCalled()
  })

  it('returns movies and hasMore when search succeeds', async () => {
    const movies = [createMovie(1, 'Movie A'), createMovie(2, 'Movie B')]
    vi.spyOn(movieService, 'searchMovies').mockResolvedValue({
      movies,
      page: 1,
      totalPages: 3,
      totalResults: 50,
      schemaErrors: [],
    })

    const { result } = renderHook(() => useSearchMovies('batman'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.movies).toHaveLength(2)
    expect(result.current.movies[0].title).toBe('Movie A')
    expect(result.current.hasMore).toBe(true)
    expect(result.current.schemaErrors).toEqual([])
  })

  it('returns schemaErrors when API response has validation errors', async () => {
    vi.spyOn(movieService, 'searchMovies').mockResolvedValue({
      movies: [],
      page: 1,
      totalPages: 0,
      totalResults: 0,
      schemaErrors: ['Expected object, received array'],
    })

    const { result } = renderHook(() => useSearchMovies('test'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.schemaErrors).toEqual([
      'Expected object, received array',
    ])
    expect(result.current.movies).toEqual([])
  })

  it('hasMore is false when on last page', async () => {
    vi.spyOn(movieService, 'searchMovies').mockResolvedValue({
      movies: [createMovie(1, 'Only One')],
      page: 1,
      totalPages: 1,
      totalResults: 1,
      schemaErrors: [],
    })

    const { result } = renderHook(() => useSearchMovies('query'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.hasMore).toBe(false)
  })

  it('sorts movies when sortOption is provided', async () => {
    const movies = [
      createMovie(1, 'Zebra'),
      createMovie(2, 'Alpha'),
      createMovie(3, 'Middle'),
    ]
    vi.spyOn(movieService, 'searchMovies').mockResolvedValue({
      movies,
      page: 1,
      totalPages: 1,
      totalResults: 3,
      schemaErrors: [],
    })

    const { result } = renderHook(() => useSearchMovies('test', 'title-asc'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.movies.map((m) => m.title)).toEqual([
      'Alpha',
      'Middle',
      'Zebra',
    ])
  })

  it('calls searchMovies with keyword and pageParam', async () => {
    const spy = vi.spyOn(movieService, 'searchMovies').mockResolvedValue({
      movies: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
      schemaErrors: [],
    })

    renderHook(() => useSearchMovies('batman'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(spy).toHaveBeenCalled())
    expect(spy).toHaveBeenCalledWith('batman', 1, expect.any(AbortSignal))
  })
})
