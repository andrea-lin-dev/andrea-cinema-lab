export interface MovieSummary {
  id: number
  title: string
  posterPath: string | null
  releaseDate: string | null
  voteAverage: number
  overview: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profilePath: string | null
}

export interface CrewMember {
  id: number
  name: string
  job: string
  profilePath: string | null
}

export interface Trailer {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface Review {
  id: string
  author: string
  content: string
  rating: number | null
  createdAt: string
}

export interface MovieDetail extends MovieSummary {
  tagline: string | null
  runtime: number | null
  genres: Array<{ id: number; name: string }>
  backdropPath: string | null
  cast: CastMember[]
  crew: CrewMember[]
  trailer: Trailer | null
  reviews: Review[]
}

export type WatchlistSortOption =
  | 'releaseDate-desc'
  | 'rating-desc'
  | 'title-asc'
