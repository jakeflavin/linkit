/** Relative time in the "6h ago" shorthand a feed uses. */

const UNITS: [limitMs: number, perMs: number, suffix: string][] = [
  [60_000, 1_000, 's'],
  [3_600_000, 60_000, 'm'],
  [86_400_000, 3_600_000, 'h'],
  [2_592_000_000, 86_400_000, 'd'],
  [31_536_000_000, 2_592_000_000, 'mo'],
  [Infinity, 31_536_000_000, 'y'],
]

export function timeAgo(at: number, now: number = Date.now()): string {
  const elapsed = Math.max(now - at, 0)
  if (elapsed < 45_000) return 'just now'

  for (const [limit, per, suffix] of UNITS) {
    if (elapsed < limit) return `${Math.floor(elapsed / per)}${suffix} ago`
  }
  return 'a while ago'
}
