import { describe, it, expect } from 'vitest'
import { searchMoviesResponseSchema, movieSummarySchema } from './tmdb'

describe('searchMoviesResponseSchema', () => {
  it('parses valid array results', () => {
    const raw = {
      page: 1,
      total_pages: 10,
      total_results: 100,
      results: [
        {
          id: 1,
          title: 'Inception',
          poster_path: '/path.jpg',
          release_date: '2010-07-16',
          vote_average: 8.4,
          overview: 'A thief who steals corporate secrets...',
        },
      ],
    }
    const parsed = searchMoviesResponseSchema.safeParse(raw)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.results).toHaveLength(1)
      expect(parsed.data.results[0]).toMatchObject({
        id: 1,
        title: 'Inception',
        poster_path: '/path.jpg',
        release_date: '2010-07-16',
        vote_average: 8.4,
      })
    }
  })

  it('does NOT parse fail when results is an object (backend returns wrong type)', () => {
    const raw = {
      page: 1,
      total_pages: 0,
      total_results: 0,
      results: { foo: 'bar' }, // object instead of array
    }
    const parsed = searchMoviesResponseSchema.safeParse(raw)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.results).toEqual([])
    }
  })

  it('filters out invalid items and keeps valid ones', () => {
    const raw = {
      page: 1,
      total_pages: 1,
      total_results: 2,
      results: [
        {
          id: 1,
          title: 'Valid Movie',
          poster_path: null,
          release_date: '2020',
          vote_average: 7,
          overview: '',
        },
        { id: 'invalid' }, // missing required fields
        null,
      ],
    }
    const parsed = searchMoviesResponseSchema.safeParse(raw)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.results).toHaveLength(1)
      expect(parsed.data.results[0]).toMatchObject({
        id: 1,
        title: 'Valid Movie',
      })
    }
  })
})

describe('movieSummarySchema', () => {
  it('applies defaults for missing optional fields', () => {
    const raw = { id: 1, poster_path: null, release_date: null }
    const parsed = movieSummarySchema.safeParse(raw)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.title).toBe('Unknown')
      expect(parsed.data.vote_average).toBe(0)
      expect(parsed.data.overview).toBe('')
    }
  })
})
