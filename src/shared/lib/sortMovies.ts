import type { MovieSummary, WatchlistItem } from '@/shared/types/domain'
import type { WatchlistSortOption } from '@/shared/types/domain'
import { formatYear } from './formatters'

export function sortMovies(
  movies: MovieSummary[],
  option: WatchlistSortOption
): MovieSummary[] {
  return [...movies].sort((a, b) => compareMovies(a, b, option))
}

export function sortWatchlistItems(
  items: WatchlistItem[],
  option: WatchlistSortOption
): WatchlistItem[] {
  if (option === 'addedAt-desc') {
    return sortWatchlistByAddedAt(items, false)
  }
  if (option === 'addedAt-asc') {
    return sortWatchlistByAddedAt(items, true)
  }
  return [...items].sort((a, b) => compareMovies(a.movie, b.movie, option))
}

export function sortWatchlistByAddedAt(
  items: WatchlistItem[],
  asc: boolean
): WatchlistItem[] {
  return [...items].sort((a, b) => {
    const diff = a.addedAt - b.addedAt
    return asc ? diff : -diff
  })
}

function compareMovies(
  a: MovieSummary,
  b: MovieSummary,
  option: WatchlistSortOption
): number {
  switch (option) {
    case 'addedAt-desc':
    case 'addedAt-asc':
      return 0
    case 'rating-desc':
      return (b.voteAverage ?? 0) - (a.voteAverage ?? 0)
    case 'releaseDate-desc': {
      const yearA = parseInt(formatYear(a.releaseDate) || '0', 10)
      const yearB = parseInt(formatYear(b.releaseDate) || '0', 10)
      return yearB - yearA
    }
    case 'title-asc':
      return (a.title ?? '').localeCompare(b.title ?? '')
    default:
      return 0
  }
}
