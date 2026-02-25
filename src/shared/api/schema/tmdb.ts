import { z } from 'zod'

const nullableString = z.union([z.string(), z.null()]).nullable()
const nullableNumber = z.union([z.number(), z.null()]).nullable()

export const movieSummarySchema = z.object({
  id: z.number(),
  title: z.string().default('Unknown'),
  poster_path: nullableString,
  release_date: nullableString,
  vote_average: z.number().default(0),
  overview: z.string().default(''),
})

export const searchMoviesResponseSchema = z.object({
  page: z.number().default(1),
  total_pages: z.number().default(0),
  total_results: z.number().default(0),
  results: z
    .union([z.array(z.unknown()), z.record(z.string(), z.unknown())])
    .transform((val) => {
      if (!Array.isArray(val)) return []
      return val
        .map((item) => {
          const parsed = movieSummarySchema.safeParse(item)
          return parsed.success ? parsed.data : null
        })
        .filter(Boolean)
    }),
})

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const castMemberSchema = z.object({
  id: z.number(),
  name: z.string().default('Unknown'),
  character: z.string().default(''),
  profile_path: nullableString,
})

export const crewMemberSchema = z.object({
  id: z.number(),
  name: z.string().default('Unknown'),
  job: z.string().default(''),
  profile_path: nullableString,
})

export const videoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string().default('YouTube'),
  type: z.string().default('Trailer'),
})

export const reviewSchema = z.object({
  id: z.string(),
  author: z.string().default('Anonymous'),
  content: z.string().default(''),
  author_details: z
    .object({
      rating: nullableNumber,
    })
    .optional()
    .transform((d) => d?.rating ?? null),
  created_at: z.string().default(''),
})

export const movieDetailSchema = z.object({
  id: z.number(),
  title: z.string().default('Unknown'),
  poster_path: nullableString,
  backdrop_path: nullableString,
  release_date: nullableString,
  vote_average: z.number().default(0),
  overview: z.string().default(''),
  tagline: nullableString,
  runtime: nullableNumber,
  genres: z
    .union([z.array(genreSchema), z.record(z.string(), z.unknown())])
    .transform((val) => (Array.isArray(val) ? val : [])),
})

export const creditsSchema = z.object({
  cast: z
    .union([z.array(castMemberSchema), z.record(z.string(), z.unknown())])
    .transform((val) => (Array.isArray(val) ? val : [])),
  crew: z
    .union([z.array(crewMemberSchema), z.record(z.string(), z.unknown())])
    .transform((val) => (Array.isArray(val) ? val : [])),
})

export const videosResponseSchema = z.object({
  results: z
    .union([z.array(videoSchema), z.record(z.string(), z.unknown())])
    .transform((val) => (Array.isArray(val) ? val : [])),
})

export const reviewsResponseSchema = z.object({
  results: z
    .union([z.array(reviewSchema), z.record(z.string(), z.unknown())])
    .transform((val) => (Array.isArray(val) ? val : [])),
})
