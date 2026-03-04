import { describe, it, expect, beforeEach, vi } from 'vitest'
import { watchlistRepository } from './WatchlistRepository'
import type { MovieSummary } from '@/shared/types/domain'

const STORAGE_KEY = 'movie-watchlist'

function createMovie(id: number, title = 'Test Movie'): MovieSummary {
  return {
    id,
    title,
    posterPath: null,
    releaseDate: '2024-01-01',
    voteAverage: 8,
    overview: '',
  }
}

describe('WatchlistRepository', () => {
  let storage: Record<string, string>

  beforeEach(() => {
    storage = {}
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value
      },
      removeItem: (key: string) => {
        delete storage[key]
      },
      clear: () => {
        storage = {}
      },
      length: 0,
      key: () => null,
    })
  })

  it('getAll returns empty when storage is empty', () => {
    const result = watchlistRepository.getAll()
    expect(result).toEqual([])
  })

  it('getAll returns items when storage has valid array', () => {
    const movie = createMovie(1)
    const items = [{ movie, addedAt: 1234567890 }]
    storage[STORAGE_KEY] = JSON.stringify(items)

    const result = watchlistRepository.getAll()
    expect(result).toHaveLength(1)
    expect(result[0].movie).toEqual(movie)
    expect(result[0].addedAt).toBe(1234567890)
  })

  it('getAll returns empty when storage has invalid JSON', () => {
    storage[STORAGE_KEY] = 'not valid json {'

    const result = watchlistRepository.getAll()
    expect(result).toEqual([])
  })

  it('getAll returns empty when storage has object instead of array', () => {
    storage[STORAGE_KEY] = JSON.stringify({ error: 'malformed' })

    const result = watchlistRepository.getAll()
    expect(result).toEqual([])
  })

  it('add adds movie and returns new list', () => {
    const movie = createMovie(42, 'Inception')
    const result = watchlistRepository.add(movie)

    expect(result).toHaveLength(1)
    expect(result[0].movie).toEqual(movie)
    expect(result[0].addedAt).toBeDefined()
    expect(typeof result[0].addedAt).toBe('number')

    const persisted = watchlistRepository.getAll()
    expect(persisted).toHaveLength(1)
    expect(persisted[0].movie.id).toBe(42)
  })

  it('add does not duplicate when movie already exists', () => {
    const movie = createMovie(99)
    const first = watchlistRepository.add(movie)
    const second = watchlistRepository.add(movie)

    expect(first).toHaveLength(1)
    expect(second).toHaveLength(1)
    expect(second[0].movie.id).toBe(99)
    expect(second[0].movie.id).toBe(first[0].movie.id)
  })

  it('remove removes movie by id', () => {
    const m1 = createMovie(1)
    const m2 = createMovie(2)
    watchlistRepository.add(m1)
    watchlistRepository.add(m2)

    const result = watchlistRepository.remove(1)

    expect(result).toHaveLength(1)
    expect(result[0].movie.id).toBe(2)

    const persisted = watchlistRepository.getAll()
    expect(persisted).toHaveLength(1)
    expect(persisted[0].movie.id).toBe(2)
  })

  it('remove returns same list when movie not found', () => {
    const movie = createMovie(1)
    watchlistRepository.add(movie)

    const result = watchlistRepository.remove(999)

    expect(result).toHaveLength(1)
    expect(result[0].movie.id).toBe(1)
  })

  it('saved items include version field', () => {
    const movie = createMovie(1)
    watchlistRepository.add(movie)

    const raw = JSON.parse(storage[STORAGE_KEY])
    expect(raw[0].version).toBe(1)
  })
})
