import { describe, it, expect } from 'vitest'
import { formatRuntime, formatYear, formatRating } from './formatters'

describe('formatRuntime', () => {
  it('formats minutes as "Xh Ym"', () => {
    expect(formatRuntime(90)).toBe('1h 30m')
    expect(formatRuntime(125)).toBe('2h 5m')
  })

  it('formats minutes only when under 60', () => {
    expect(formatRuntime(45)).toBe('45m')
    expect(formatRuntime(0)).toBe('')
  })

  it('returns empty string for null or invalid', () => {
    expect(formatRuntime(null)).toBe('')
    expect(formatRuntime(0)).toBe('')
    expect(formatRuntime(-1)).toBe('')
  })
})

describe('formatYear', () => {
  it('extracts 4-digit year from date string', () => {
    expect(formatYear('2020-07-16')).toBe('2020')
    expect(formatYear('1999-01-01')).toBe('1999')
  })

  it('returns empty string for empty or invalid', () => {
    expect(formatYear('')).toBe('')
    expect(formatYear(null)).toBe('')
    expect(formatYear('invalid')).toBe('')
  })
})

describe('formatRating', () => {
  it('formats vote average to 1 decimal', () => {
    expect(formatRating(8.456)).toBe('8.5')
    expect(formatRating(7.0)).toBe('7.0')
  })

  it('returns em dash for zero or negative', () => {
    expect(formatRating(0)).toBe('—')
    expect(formatRating(-1)).toBe('—')
  })
})
