import { describe, expect, it } from 'vitest'
import { timeAgo } from './time.ts'

const NOW = 1_700_000_000_000

describe('timeAgo', () => {
  it('calls anything under a minute just now', () => {
    expect(timeAgo(NOW - 5_000, NOW)).toBe('just now')
  })

  it('steps up through the units', () => {
    expect(timeAgo(NOW - 90_000, NOW)).toBe('1m ago')
    expect(timeAgo(NOW - 5 * 3_600_000, NOW)).toBe('5h ago')
    expect(timeAgo(NOW - 3 * 86_400_000, NOW)).toBe('3d ago')
    expect(timeAgo(NOW - 60 * 86_400_000, NOW)).toBe('2mo ago')
    expect(timeAgo(NOW - 400 * 86_400_000, NOW)).toBe('1y ago')
  })

  it('never reads as the future when clocks disagree', () => {
    expect(timeAgo(NOW + 60_000, NOW)).toBe('just now')
  })
})
