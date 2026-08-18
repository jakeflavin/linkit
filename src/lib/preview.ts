/**
 * Resolving a link's featured image and real title.
 *
 * A browser cannot read another origin's `og:` tags, and linkit has no
 * server, so this goes through Microlink's open unfurl endpoint. That is a
 * third-party dependency with a per-IP daily quota, which is why it runs
 * exactly once — when a link is posted — and the result is stored on the
 * document. Readers never call it, so the quota falls on each submitter's own
 * IP rather than on whoever happens to open the feed.
 *
 * Every failure is silent and returns null: a preview is a nicety, and never
 * a reason a post cannot go up.
 */

const ENDPOINT = 'https://api.microlink.io/'
const TIMEOUT_MS = 8000

export interface Preview {
  title: string | null
  image: string | null
}

/**
 * Pulls the pieces we use out of an unfurl payload. Separated from the fetch
 * so the shape handling can be tested without a network.
 */
export function parsePreview(payload: unknown): Preview {
  if (typeof payload !== 'object' || payload === null) return { title: null, image: null }

  const body = payload as { status?: unknown; data?: unknown }
  if (body.status !== 'success' || typeof body.data !== 'object' || body.data === null) {
    return { title: null, image: null }
  }

  const data = body.data as { title?: unknown; image?: unknown }
  const image = typeof data.image === 'object' && data.image !== null ? data.image : {}

  return {
    title: cleanTitle(data.title),
    // Only https, so a preview can never downgrade the page to mixed content.
    image: httpsOnly((image as { url?: unknown }).url),
  }
}

function cleanTitle(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().replace(/\s+/g, ' ')
  if (!trimmed) return null
  return trimmed.length > 300 ? trimmed.slice(0, 300).trimEnd() : trimmed
}

function httpsOnly(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null
  try {
    return new URL(value).protocol === 'https:' ? value : null
  } catch {
    return null
  }
}

/**
 * Asks the unfurl service about a URL. Never throws and never takes longer
 * than {@link TIMEOUT_MS} — the caller is a person waiting on a form.
 */
export async function fetchPreview(url: string): Promise<Preview> {
  const empty: Preview = { title: null, image: null }

  try {
    const response = await fetch(`${ENDPOINT}?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return empty
    return parsePreview(await response.json())
  } catch {
    return empty
  }
}
