import { useState, useCallback, useEffect, useRef } from 'react'
import { getImageUrl } from '@/shared/api/raw/client'
import type { MovieSummary } from '@/shared/types/domain'

const SPIN_INTERVAL_MS = 120
const SPIN_DURATION_MS = 3500

interface LotteryCarouselProps {
  movies: MovieSummary[]
  onWinner?: (movie: MovieSummary) => void
}

export function LotteryCarousel({ movies, onWinner }: LotteryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopCycle = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => stopCycle, [stopCycle])

  const pick = useCallback(() => {
    if (movies.length === 0 || isSpinning) return

    setIsSpinning(true)
    const winnerIndex = Math.floor(Math.random() * movies.length)

    const revealAndFinish = () => {
      setIsRevealing(true)
      setTimeout(() => {
        onWinner?.(movies[winnerIndex])
        setIsSpinning(false)
        setIsRevealing(false)
      }, 600)
    }

    if (movies.length <= 1) {
      setCurrentIndex(winnerIndex)
      revealAndFinish()
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % movies.length)
    }, SPIN_INTERVAL_MS)

    setTimeout(() => {
      stopCycle()
      setCurrentIndex(winnerIndex)
      revealAndFinish()
    }, SPIN_DURATION_MS)
  }, [movies, isSpinning, onWinner, stopCycle])

  if (movies.length === 0) return null

  const movie = movies[currentIndex]
  const posterUrl = getImageUrl(movie.posterPath, 'w342')

  return (
    <div className="flex shrink-0 flex-col items-center gap-4">
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <div className="aspect-[2/3] w-48 sm:w-56">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brown-200 text-stone-500">
              無海報
            </div>
          )}
        </div>
        {isRevealing && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40">
            <span className="text-lg font-semibold text-white">抽中！</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={pick}
        disabled={isSpinning}
        className="rounded-xl bg-lavender-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-lavender-600 disabled:pointer-events-none disabled:opacity-70"
      >
        {isSpinning ? '抽籤中...' : '開始抽籤'}
      </button>
    </div>
  )
}
