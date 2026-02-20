import { z } from 'zod'

const nullableString = z.union([z.string(), z.null()]).nullable()

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
  results: z.array(z.unknown()).transform((arr) => {
    if (!Array.isArray(arr)) return []
    return arr
      .map((item) => {
        const parsed = movieSummarySchema.safeParse(item)
        return parsed.success ? parsed.data : null
      })
      .filter(Boolean)
  }),
})
