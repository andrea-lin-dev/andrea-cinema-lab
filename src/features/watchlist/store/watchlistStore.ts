import { create } from 'zustand'
import type { MovieSummary } from '@/shared/types/domain'
import { watchlistRepository } from '../repo/WatchlistRepository'

export interface WatchlistItem {
  movie: MovieSummary
  addedAt: number
}

interface WatchlistState {
  items: WatchlistItem[]
  load: () => void
  add: (movie: MovieSummary) => void
  remove: (movieId: number) => void
  has: (movieId: number) => boolean
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],

  load: () => {
    const items = watchlistRepository.getAll()
    set({ items })
  },

  add: (movie) => {
    const items = watchlistRepository.add(movie)
    set({ items })
  },

  remove: (movieId) => {
    const items = watchlistRepository.remove(movieId)
    set({ items })
  },

  has: (movieId) => {
    return get().items.some((i) => i.movie.id === movieId)
  },
}))
