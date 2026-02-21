import { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '@/shared/api/raw/client'
import type { MovieSummary } from '@/shared/types/domain'

const SPIN_INTERVAL_MS = 120
const SPIN_DURATION_MS = 3500

interface LotteryCarouselProps {
  movies: MovieSummary[]
  onCloseModal?: () => void
}

export function LotteryCarousel({
  movies,
  onCloseModal,
}: LotteryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [winner, setWinner] = useState<MovieSummary | null>(null)
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
    setWinner(null)
    const winnerIndex = Math.floor(Math.random() * movies.length)

    const revealAndFinish = () => {
      setIsRevealing(true)
      setTimeout(() => {
        setWinner(movies[winnerIndex])
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
  }, [movies, isSpinning, stopCycle])

  const handleReset = useCallback(() => {
    setWinner(null)
    pick()
  }, [pick])

  if (movies.length === 0) return null

  const movie = winner ?? movies[currentIndex]
  const posterUrl = getImageUrl(movie.posterPath, 'w342')
  const showPlaceholder = !winner && !isSpinning && !isRevealing

  return (
    <div className="flex shrink-0 flex-col items-center gap-4">
      {/* 固定高度區塊：就決定是你了 - 避免按鈕位移 */}
      <div className="flex min-h-[2rem] items-center justify-center">
        {winner && (
          <p className="text-lg font-semibold text-lavender-600">
            就決定是你了！
          </p>
        )}
      </div>

      {/* Poster - 未抽籤時顯示問號卡片，抽中後可點擊 */}
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        {showPlaceholder ? (
          <div className="flex aspect-[2/3] w-48 sm:w-56 items-center justify-center rounded-xl bg-brown-100">
            <span className="text-6xl opacity-60" aria-hidden>
              ❓
            </span>
          </div>
        ) : winner ? (
          <Link
            to={`/movie/${winner.id}`}
            onClick={onCloseModal}
            className="block transition-transform hover:scale-[1.02]"
          >
            <div className="aspect-[2/3] w-48 sm:w-56">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={winner.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brown-200 text-stone-500">
                  無海報
                </div>
              )}
            </div>
          </Link>
        ) : (
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
        )}
        {isRevealing && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40">
            <span className="text-lg font-semibold text-white">抽中！</span>
          </div>
        )}
      </div>

      {/* 固定高度區塊：電影名稱 - 抽中後可點擊 */}
      <div className="flex min-h-[2.5rem] items-center justify-center">
        {winner && (
          <Link
            to={`/movie/${winner.id}`}
            onClick={onCloseModal}
            className="text-center text-xl font-bold text-stone-800 underline-offset-2 transition-colors hover:text-lavender-600 hover:underline"
          >
            {winner.title}
          </Link>
        )}
      </div>

      {/* 按鈕列：固定位置，內容切換 */}
      <div className="flex min-h-[3rem] items-center justify-center gap-3">
        {winner ? (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl bg-lavender-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-lavender-600"
          >
            重新抽籤
          </button>
        ) : (
          <button
            type="button"
            onClick={pick}
            disabled={isSpinning}
            className="rounded-xl bg-lavender-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-lavender-600 disabled:pointer-events-none disabled:opacity-70"
          >
            {isSpinning ? '抽籤中...' : '開始抽籤'}
          </button>
        )}
      </div>
    </div>
  )
}
