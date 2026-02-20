export interface MovieSummary {
  id: number
  title: string
  posterPath: string | null
  releaseDate: string | null
  voteAverage: number
  overview: string
}

export type WatchlistSortOption =
  | 'releaseDate-desc'
  | 'rating-desc'
  | 'title-asc'
