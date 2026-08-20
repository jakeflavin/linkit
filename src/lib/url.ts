/** URL parsing and validation. Pure — no DOM, no network. */

const MAX_TITLE = 300

/**
 * Normalizes user input into an absolute https URL.
 * Accepts bare hosts ("example.com") by assuming https.
 * @returns the normalized URL, or null if it cannot be one.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let url: URL
  try {
    url = new URL(withScheme)
  } catch {
    return null
  }

  // http is upgraded rather than rejected: the submitter almost always meant https.
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  url.protocol = 'https:'

  // A hostname needs a dot and a label on each side to be a real site.
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)) return null

  url.hash = ''
  return url.toString()
}

/** Hostname without a leading `www.`, lowercased. Empty string if unparseable. */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, '').toLowerCase()
  } catch {
    return ''
  }
}

/**
 * A domain's favicon — no key, no CORS, best mainstream coverage. Loaded as a
 * background image (see Thumb/LinkRow), so a domain with no icon falls back to
 * the link glyph rather than a broken image. A favicon-less domain still logs a
 * network 404, which no third-party favicon service can avoid without a HEAD
 * precheck; on a board of real links it is rare.
 */
export function faviconFor(domain: string): string {
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`
}

export interface DraftErrors {
  url?: string
  title?: string
  category?: string
}

/** Validates a submission. An empty object means it is ready to send. */
export function validateDraft(
  url: string,
  title: string,
  category: string,
  knownCategories: readonly string[],
): DraftErrors {
  const errors: DraftErrors = {}

  if (!url.trim()) errors.url = 'Paste a link.'
  else if (!normalizeUrl(url)) errors.url = "That doesn't look like a web address."

  const t = title.trim()
  if (!t) errors.title = 'Give it a title.'
  else if (t.length > MAX_TITLE) errors.title = `Titles cap at ${MAX_TITLE} characters.`

  if (!category) errors.category = 'Pick a community.'
  else if (!knownCategories.includes(category)) errors.category = 'Pick a community.'

  return errors
}
