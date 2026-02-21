import type { MovieSummary } from '@/shared/types/domain'

const STORAGE_KEY = 'movie-watchlist'
const VERSION = 1

export interface StoredWatchlistItem {
  movie: MovieSummary
  addedAt: number
  version?: number
}

function loadRaw(): StoredWatchlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      ...item,
      version: item.version ?? VERSION,
    }))
  } catch {
    return []
  }
}

function save(items: StoredWatchlistItem[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.map((i) => ({ ...i, version: VERSION })))
    )
  } catch (e) {
    console.error('WatchlistRepository save failed:', e)
  }
}

export const watchlistRepository = {
  getAll(): StoredWatchlistItem[] {
    return loadRaw()
  },

  add(movie: MovieSummary): StoredWatchlistItem[] {
    const items = loadRaw()
    if (items.some((i) => i.movie.id === movie.id)) return items
    const next = [...items, { movie, addedAt: Date.now() }]
    save(next)
    return next
  },

  remove(movieId: number): StoredWatchlistItem[] {
    const items = loadRaw().filter((i) => i.movie.id !== movieId)
    save(items)
    return items
  },
}
