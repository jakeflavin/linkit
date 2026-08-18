/**
 * Fills the local Firestore emulator with a believable board so the feed,
 * the sorts, and the removal threshold can all be seen at once.
 *
 * Run the emulator first (`npm run emulators`), then `npm run seed`. It
 * writes over the emulator's REST API so it needs no service account, and it
 * refuses to run against anything but localhost. The emulator's `owner` token
 * bypasses firestore.rules — real posts start at one upvote and cannot
 * backdate themselves, which is exactly what those rules enforce.
 */

const HOST = '127.0.0.1:8080'
const BASE = `http://${HOST}/v1/projects/linkit-web/databases/(default)/documents/links`

const HOUR = 3_600_000

/** [title, url, category, ups, downs, hours old] */
const SEED = [
  ['Excalidraw — hand-drawn diagrams in the browser', 'https://excalidraw.com', 'design', 312, 4, 3],
  ['Every layout: algorithms for CSS you stop fighting', 'https://every-layout.dev', 'design', 188, 6, 9],
  ['The Rust Book, still the best free programming book', 'https://doc.rust-lang.org/book/', 'learn', 274, 9, 20],
  ['Regex101 — build and explain a regex live', 'https://regex101.com', 'tools', 401, 11, 44],
  ['tldraw makes an infinite canvas you can embed', 'https://tldraw.dev', 'tools', 96, 3, 2],
  ['Our World in Data — every chart is downloadable', 'https://ourworldindata.org', 'data', 233, 7, 30],
  ['Open-Meteo: a weather API with no key at all', 'https://open-meteo.com', 'data', 141, 2, 52],
  ['Anthropic docs — prompt engineering, properly explained', 'https://docs.anthropic.com', 'ai', 205, 8, 7],
  ['A visual guide to how transformers actually work', 'https://jalammar.github.io/illustrated-transformer/', 'ai', 356, 5, 61],
  ['Paul Graham on how to do great work', 'https://paulgraham.com/greatwork.html', 'reading', 178, 14, 90],
  ['The Wayback Machine, for when a link finally dies', 'https://web.archive.org', 'reading', 122, 3, 15],
  ['Windows 95 running in a browser tab', 'https://copy.sh/v86/', 'fun', 267, 12, 5],
  ['The Useless Web, one button, no regrets', 'https://theuselessweb.com', 'fun', 44, 21, 26],
  ['Stripe on pricing, from the people who charge for everything', 'https://stripe.com/guides', 'money', 87, 4, 38],
  ['Examine — supplements, graded by actual evidence', 'https://examine.com', 'health', 156, 6, 12],
  ['Sleep Foundation on why your schedule beats your gadget', 'https://sleepfoundation.org', 'health', 63, 5, 70],
  ['Can I Use — browser support without the guesswork', 'https://caniuse.com', 'tools', 298, 2, 100],
  ['This link is about to get removed', 'https://example.com/doomed', 'misc', 2, 6, 4],
]

if (!HOST.startsWith('127.0.0.1')) throw new Error('seed only ever runs against the emulator')

const now = Date.now()

for (const [title, url, category, ups, downs, hoursOld] of SEED) {
  const createdAt = new Date(now - hoursOld * HOUR).toISOString()
  const response = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({
      fields: {
        url: { stringValue: url },
        title: { stringValue: title },
        domain: { stringValue: new URL(url).hostname.replace(/^www\./, '') },
        category: { stringValue: category },
        createdAt: { timestampValue: createdAt },
        ups: { integerValue: String(ups) },
        downs: { integerValue: String(downs) },
      },
    }),
  })

  if (!response.ok) throw new Error(`${title}: ${response.status} ${await response.text()}`)
}

console.log(`seeded ${SEED.length} links into the emulator`)
