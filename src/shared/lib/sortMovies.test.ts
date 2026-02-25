import { describe, it, expect } from 'vitest'
import { sortMovies, sortWatchlistByAddedAt } from './sortMovies'
import type { MovieSummary, WatchlistItem } from '@/shared/types/domain'

const movieA: MovieSummary = {
  id: 1,
  title: 'Avatar',
  posterPath: null,
  releaseDate: '2009-12-18',
  voteAverage: 7.5,
  overview: '',
}
const movieB: MovieSummary = {
  id: 2,
  title: 'Inception',
  posterPath: null,
  releaseDate: '2010-07-16',
  voteAverage: 8.8,
  overview: '',
}
const movieC: MovieSummary = {
  id: 3,
  title: 'Zoolander',
  posterPath: null,
  releaseDate: '2001-09-28',
  voteAverage: 6.5,
  overview: '',
}

describe('sortMovies', () => {
  it('sorts by rating descending', () => {
    const movies = [movieA, movieB, movieC]
    const sorted = sortMovies(movies, 'rating-desc')
    expect(sorted[0].title).toBe('Inception')
    expect(sorted[1].title).toBe('Avatar')
    expect(sorted[2].title).toBe('Zoolander')
  })

  it('sorts by release date descending', () => {
    const movies = [movieA, movieB, movieC]
    const sorted = sortMovies(movies, 'releaseDate-desc')
    expect(sorted[0].title).toBe('Inception')
    expect(sorted[1].title).toBe('Avatar')
    expect(sorted[2].title).toBe('Zoolander')
  })

  it('sorts by title ascending', () => {
    const movies = [movieA, movieB, movieC]
    const sorted = sortMovies(movies, 'title-asc')
    expect(sorted[0].title).toBe('Avatar')
    expect(sorted[1].title).toBe('Inception')
    expect(sorted[2].title).toBe('Zoolander')
  })

  it('does not mutate original array', () => {
    const movies = [movieA, movieB, movieC]
    const copy = [...movies]
    sortMovies(movies, 'rating-desc')
    expect(movies).toEqual(copy)
  })
})

describe('sortWatchlistByAddedAt', () => {
  const items: WatchlistItem[] = [
    { movie: movieA, addedAt: 1000 },
    { movie: movieB, addedAt: 2000 },
    { movie: movieC, addedAt: 3000 },
  ]

  it('sorts by addedAt ascending', () => {
    const sorted = sortWatchlistByAddedAt(items, true)
    expect(sorted[0].movie.title).toBe('Avatar')
    expect(sorted[2].movie.title).toBe('Zoolander')
  })

  it('sorts by addedAt descending', () => {
    const sorted = sortWatchlistByAddedAt(items, false)
    expect(sorted[0].movie.title).toBe('Zoolander')
    expect(sorted[2].movie.title).toBe('Avatar')
  })
})
