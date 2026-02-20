import type { MovieSummary } from '@/shared/types/domain'
import type { WatchlistSortOption } from '@/shared/types/domain'
import { formatYear } from './formatters'

export function sortMovies(
  movies: MovieSummary[],
  option: WatchlistSortOption
): MovieSummary[] {
  return [...movies].sort((a, b) => compareMovies(a, b, option))
}

function compareMovies(
  a: MovieSummary,
  b: MovieSummary,
  option: WatchlistSortOption
): number {
  switch (option) {
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
