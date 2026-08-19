import { describe, expect, it } from 'vitest'
import {
  REMOVAL_SCORE,
  applyVote,
  isRemoved,
  matchesQuery,
  rankLinks,
  resolveVote,
  scoreOf,
} from './ranking.ts'
import type { Link } from './types.ts'

const NOW = 1_700_000_000_000
const HOUR = 3_600_000

function link(over: Partial<Link> & { id: string }): Link {
  return {
    url: `https://example.com/${over.id}`,
    title: over.id,
    domain: 'example.com',
    category: 'tools',
    createdAt: NOW,
    ups: 0,
    downs: 0,
    image: null,
    ...over,
  }
}

describe('scoreOf', () => {
  it('is ups minus downs', () => {
    expect(scoreOf(link({ id: 'a', ups: 9, downs: 4 }))).toBe(5)
  })
})

describe('isRemoved', () => {
  it('removes at the threshold, not before it', () => {
    expect(isRemoved(link({ id: 'a', downs: -REMOVAL_SCORE - 1 }))).toBe(false)
    expect(isRemoved(link({ id: 'b', downs: -REMOVAL_SCORE }))).toBe(true)
    expect(isRemoved(link({ id: 'c', downs: -REMOVAL_SCORE + 5 }))).toBe(true)
  })
})

describe('rankLinks', () => {
  const votes = {}

  it('drops removed links from every sort', () => {
    const links = [link({ id: 'keep', ups: 3 }), link({ id: 'gone', downs: 9 })]
    for (const sort of ['hot', 'new', 'top', 'rising'] as const) {
      expect(rankLinks(links, sort, votes, NOW).map((l) => l.id)).toEqual(['keep'])
    }
  })

  it('sorts top purely by score', () => {
    const links = [
      link({ id: 'low', ups: 2, createdAt: NOW }),
      link({ id: 'high', ups: 40, createdAt: NOW - 100 * HOUR }),
    ]
    expect(rankLinks(links, 'top', votes, NOW).map((l) => l.id)).toEqual(['high', 'low'])
  })

  it('sorts new purely by recency', () => {
    const links = [
      link({ id: 'old', ups: 99, createdAt: NOW - HOUR }),
      link({ id: 'fresh', ups: 0, createdAt: NOW }),
    ]
    expect(rankLinks(links, 'new', votes, NOW).map((l) => l.id)).toEqual(['fresh', 'old'])
  })

  it('lets hot favour a fresh link over an old one of equal score', () => {
    const links = [
      link({ id: 'old', ups: 10, createdAt: NOW - 48 * HOUR }),
      link({ id: 'fresh', ups: 10, createdAt: NOW }),
    ]
    expect(rankLinks(links, 'hot', votes, NOW)[0]?.id).toBe('fresh')
  })

  it('lets hot favour a much higher score over freshness', () => {
    const links = [
      link({ id: 'huge', ups: 5000, createdAt: NOW - 6 * HOUR }),
      link({ id: 'fresh', ups: 1, createdAt: NOW }),
    ]
    expect(rankLinks(links, 'hot', votes, NOW)[0]?.id).toBe('huge')
  })

  it('excludes links older than the rising window', () => {
    const links = [
      link({ id: 'stale', ups: 500, createdAt: NOW - 24 * HOUR }),
      link({ id: 'climbing', ups: 6, createdAt: NOW - HOUR }),
    ]
    expect(rankLinks(links, 'rising', votes, NOW)[0]?.id).toBe('climbing')
  })

  it('attaches this browser vote to each link', () => {
    const links = [link({ id: 'a', ups: 1 }), link({ id: 'b', ups: 1 })]
    const ranked = rankLinks(links, 'new', { a: 1 } as const, NOW)
    expect(ranked.find((l) => l.id === 'a')?.vote).toBe(1)
    expect(ranked.find((l) => l.id === 'b')?.vote).toBe(0)
  })

  it('breaks ties by recency', () => {
    const links = [
      link({ id: 'older', ups: 5, createdAt: NOW - HOUR }),
      link({ id: 'newer', ups: 5, createdAt: NOW }),
    ]
    expect(rankLinks(links, 'top', {}, NOW).map((l) => l.id)).toEqual(['newer', 'older'])
  })
})

describe('matchesQuery', () => {
  const subject = link({
    id: 'a',
    title: 'Excalidraw',
    domain: 'excalidraw.com',
    category: 'design',
  })

  it('matches an empty query', () => {
    expect(matchesQuery(subject, '   ')).toBe(true)
  })

  it('matches title, domain, and category case-insensitively', () => {
    expect(matchesQuery(subject, 'EXCALI')).toBe(true)
    expect(matchesQuery(subject, '.com')).toBe(true)
    expect(matchesQuery(subject, 'Design')).toBe(true)
  })

  it('does not match unrelated text', () => {
    expect(matchesQuery(subject, 'kubernetes')).toBe(false)
  })
})

describe('resolveVote', () => {
  it('casts a vote from nothing', () => {
    expect(resolveVote(0, 1)).toBe(1)
    expect(resolveVote(0, -1)).toBe(-1)
  })

  it('clears the vote when the same arrow is clicked again', () => {
    expect(resolveVote(1, 1)).toBe(0)
    expect(resolveVote(-1, -1)).toBe(0)
  })

  it('switches direction when the other arrow is clicked', () => {
    expect(resolveVote(1, -1)).toBe(-1)
    expect(resolveVote(-1, 1)).toBe(1)
  })
})

describe('applyVote', () => {
  const start = { ups: 10, downs: 4 }

  it('moves one tally when casting', () => {
    expect(applyVote(start, 0, 1)).toEqual({ ups: 11, downs: 4 })
    expect(applyVote(start, 0, -1)).toEqual({ ups: 10, downs: 5 })
  })

  it('moves one tally when clearing', () => {
    expect(applyVote(start, 1, 0)).toEqual({ ups: 9, downs: 4 })
    expect(applyVote(start, -1, 0)).toEqual({ ups: 10, downs: 3 })
  })

  // firestore.rules has to permit this: both tallies move at once.
  it('moves both tallies in opposite directions when switching', () => {
    expect(applyVote(start, 1, -1)).toEqual({ ups: 9, downs: 5 })
    expect(applyVote(start, -1, 1)).toEqual({ ups: 11, downs: 3 })
  })

  it('never lets a tally go negative', () => {
    expect(applyVote({ ups: 0, downs: 0 }, 1, 0)).toEqual({ ups: 0, downs: 0 })
    expect(applyVote({ ups: 0, downs: 0 }, -1, 0)).toEqual({ ups: 0, downs: 0 })
  })

  it('round-trips, so a rolled-back guess restores the original tallies', () => {
    for (const [from, to] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [1, -1],
      [-1, 1],
    ] as const) {
      expect(applyVote(applyVote(start, from, to), to, from)).toEqual(start)
    }
  })
})
