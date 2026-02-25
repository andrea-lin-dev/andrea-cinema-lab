import { describe, it, expect } from 'vitest'
import { adaptSearchResults } from './movieAdapter'

describe('adaptSearchResults', () => {
  it('adapts valid API response to MovieSummary[]', () => {
    const raw = {
      page: 1,
      total_pages: 5,
      total_results: 50,
      results: [
        {
          id: 123,
          title: 'The Dark Knight',
          poster_path: '/poster.jpg',
          release_date: '2008-07-18',
          vote_average: 9.0,
          overview: 'Batman fights Joker.',
        },
      ],
    }
    const result = adaptSearchResults(raw)
    expect(result.movies).toHaveLength(1)
    expect(result.movies[0]).toEqual({
      id: 123,
      title: 'The Dark Knight',
      posterPath: '/poster.jpg',
      releaseDate: '2008-07-18',
      voteAverage: 9.0,
      overview: 'Batman fights Joker.',
    })
    expect(result.page).toBe(1)
    expect(result.totalPages).toBe(5)
    expect(result.totalResults).toBe(50)
    expect(result.schemaErrors).toHaveLength(0)
  })

  it('returns empty movies and defaults when results is object (API malformed)', () => {
    const raw = {
      page: 2,
      total_pages: 0,
      total_results: 0,
      results: { error: 'something went wrong' },
    }
    const result = adaptSearchResults(raw)
    expect(result.movies).toEqual([])
    expect(result.page).toBe(2)
    expect(result.totalPages).toBe(0)
    expect(result.totalResults).toBe(0)
    expect(result.schemaErrors).toHaveLength(0)
  })

  it('returns empty movies and schemaErrors when parse fails entirely', () => {
    const raw = null
    const result = adaptSearchResults(raw)
    expect(result.movies).toEqual([])
    expect(result.page).toBe(1)
    expect(result.totalPages).toBe(0)
    expect(result.totalResults).toBe(0)
    expect(result.schemaErrors.length).toBeGreaterThan(0)
  })
})
