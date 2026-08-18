/**
 * Sorting and the removal rule. Pure functions over links — the only place
 * that decides what "hot" means, so the sort tabs and tests agree by
 * construction.
 */

import type { Link, RankedLink, SortKey, VoteDir } from './types.ts'

/** A link at or below this score is community-removed. */
export const REMOVAL_SCORE = -5

/** Reddit's decay constant: 45000s ≈ 12.5h buys one order of magnitude. */
const DECAY_SECONDS = 45000

/** Posts younger than this are eligible for the rising tab. */
const RISING_WINDOW_MS = 12 * 60 * 60 * 1000

export function scoreOf(link: Link): number {
  return link.ups - link.downs
}

/**
 * Reddit's "hot" ranking. Monotonic in time, so a stored value would never
 * need recomputing — but the list is small enough to rank on read.
 */
export function hotRank(link: Link, now: number = Date.now()): number {
  const score = scoreOf(link)
  const order = Math.log10(Math.max(Math.abs(score), 1))
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0
  const ageSeconds = (link.createdAt - now) / 1000
  return order + (sign * ageSeconds) / DECAY_SECONDS
}

/**
 * Score per hour since posting, for the rising tab. Old posts are excluded
 * rather than damped, so "rising" always means "right now".
 */
export function risingRank(link: Link, now: number = Date.now()): number {
  const ageMs = now - link.createdAt
  if (ageMs > RISING_WINDOW_MS) return -Infinity
  const ageHours = Math.max(ageMs, 60_000) / 3_600_000
  return scoreOf(link) / ageHours
}

/** True once the community has voted a link off the board. */
export function isRemoved(link: Link): boolean {
  return scoreOf(link) <= REMOVAL_SCORE
}

/**
 * Turns raw links into the list a view renders: removed links dropped, this
 * browser's votes attached, then sorted.
 */
export function rankLinks(
  links: readonly Link[],
  sort: SortKey,
  votes: Readonly<Record<string, VoteDir>>,
  now: number = Date.now()
): RankedLink[] {
  const ranked: RankedLink[] = links
    .filter((link) => !isRemoved(link))
    .map((link) => ({ ...link, score: scoreOf(link), vote: votes[link.id] ?? 0 }))

  const by: Record<SortKey, (a: Link, b: Link) => number> = {
    hot: (a, b) => hotRank(b, now) - hotRank(a, now),
    new: (a, b) => b.createdAt - a.createdAt,
    top: (a, b) => scoreOf(b) - scoreOf(a),
    rising: (a, b) => risingRank(b, now) - risingRank(a, now),
  }

  // Ties resolve by recency so the order is stable and never arbitrary.
  return ranked.sort((a, b) => by[sort](a, b) || b.createdAt - a.createdAt)
}

/**
 * What a click on an arrow means: casting the same direction twice clears the
 * vote, as the arrows do on Reddit.
 */
export function resolveVote(previous: VoteDir, clicked: VoteDir): VoteDir {
  return previous === clicked ? 0 : clicked
}

/**
 * The tallies after a vote changes from `previous` to `next`. Switching
 * direction moves both tallies at once — the case that firestore.rules has to
 * allow, and the reason this lives in one tested function rather than being
 * written out at each call site.
 */
export function applyVote(
  tallies: { ups: number; downs: number },
  previous: VoteDir,
  next: VoteDir
): { ups: number; downs: number } {
  return {
    ups: Math.max(tallies.ups + (next === 1 ? 1 : 0) - (previous === 1 ? 1 : 0), 0),
    downs: Math.max(tallies.downs + (next === -1 ? 1 : 0) - (previous === -1 ? 1 : 0), 0),
  }
}

/** Case-insensitive match across the fields a reader can see. */
export function matchesQuery(link: Link, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    link.title.toLowerCase().includes(q) ||
    link.domain.includes(q) ||
    link.category.toLowerCase().includes(q)
  )
}
