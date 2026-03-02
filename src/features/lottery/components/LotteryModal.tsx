import { useEffect } from 'react'
import { LotteryCarousel } from './LotteryCarousel'
import type { MovieSummary } from '@/shared/types/domain'

interface LotteryModalProps {
  isOpen: boolean
  onClose: () => void
  movies: MovieSummary[]
}

export function LotteryModal({ isOpen, onClose, movies }: LotteryModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/90 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lottery-title"
    >
      <div className="relative flex w-full min-w-[400px] max-w-2xl flex-col items-center overflow-hidden rounded-2xl bg-neutral-50 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-500 transition-colors hover:bg-neutral-200 hover:text-stone-800"
          aria-label="關閉"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2
          id="lottery-title"
          className="mb-1 text-2xl font-bold text-stone-800"
        >
          🍿 今晚看什麼？
        </h2>
        <p className="mb-4 text-stone-600">點擊抽籤，讓命運幫你決定</p>

        <LotteryCarousel movies={movies} onCloseModal={onClose} />
      </div>
    </div>
  )
}
