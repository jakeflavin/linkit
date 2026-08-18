/**
 * Anonymous identity. linkit has no accounts, so a voter is a random id kept
 * in this browser. It stops the same browser voting twice and nothing more —
 * anyone determined to stuff the ballot can clear storage, which is the
 * honest trade for having no sign-up.
 */

const KEY = 'linkit:voter'

let cached: string | null = null

export function voterId(): string {
  if (cached) return cached

  try {
    const stored = localStorage.getItem(KEY)
    if (stored) {
      cached = stored
      return stored
    }
    const fresh = crypto.randomUUID()
    localStorage.setItem(KEY, fresh)
    cached = fresh
    return fresh
  } catch {
    // Private mode with storage blocked: votes work for this page load only.
    cached ??= crypto.randomUUID()
    return cached
  }
}
