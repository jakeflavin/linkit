/**
 * Fills the local Firestore emulator with a believable board so the feed,
 * the sorts, the preview images, and the removal threshold can all be seen at
 * once. Some rows deliberately have no image, because that is the common case
 * and the fallback tile needs looking at too.
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

/** [title, url, category, ups, downs, hours old, og:image or null] */
const SEED = [
  ['Excalidraw — hand-drawn diagrams in the browser', 'https://excalidraw.com', 'design', 312, 4, 3, 'https://excalidraw.com/og-image-3.png'],
  ['Every layout: algorithms for CSS you stop fighting', 'https://every-layout.dev', 'design', 188, 6, 9, 'https://every-layout.dev/images/card.png'],
  ['The Rust Book, still the best free programming book', 'https://doc.rust-lang.org/book/', 'learn', 274, 9, 20, null],
  ['Regex101 — build and explain a regex live', 'https://regex101.com', 'tools', 401, 11, 44, 'https://regex101.com/preview/'],
  ['tldraw makes an infinite canvas you can embed', 'https://tldraw.dev', 'tools', 96, 3, 2, 'https://cdn.sanity.io/images/ij3ytvrl/production/9bbdab1656512165d2426e787a553be0a8fd60a6-512x256.webp?w=1200&fit=max'],
  ['Our World in Data — every chart is downloadable', 'https://ourworldindata.org', 'data', 233, 7, 30, 'https://ourworldindata.org/default-thumbnail.png'],
  ['Open-Meteo: a weather API with no key at all', 'https://open-meteo.com', 'data', 141, 2, 52, null],
  ['Anthropic docs — prompt engineering, properly explained', 'https://docs.anthropic.com', 'ai', 205, 8, 7, 'https://platform.claude.com/docs/images/og-claude-platform-docs.png'],
  ['A visual guide to how transformers actually work', 'https://jalammar.github.io/illustrated-transformer/', 'ai', 356, 5, 61, null],
  ['Paul Graham on how to do great work', 'https://paulgraham.com/greatwork.html', 'reading', 178, 14, 90, null],
  ['The Wayback Machine, for when a link finally dies', 'https://web.archive.org', 'reading', 122, 3, 15, null],
  ['Windows 95 running in a browser tab', 'https://copy.sh/v86/', 'fun', 267, 12, 5, null],
  ['The Useless Web, one button, no regrets', 'https://theuselessweb.com', 'fun', 44, 21, 26, null],
  ['Stripe on pricing, from the people who charge for everything', 'https://stripe.com/guides', 'money', 87, 4, 38, null],
  ['Examine — supplements, graded by actual evidence', 'https://examine.com', 'health', 156, 6, 12, null],
  ['Sleep Foundation on why your schedule beats your gadget', 'https://sleepfoundation.org', 'health', 63, 5, 70, null],
  ['Can I Use — browser support without the guesswork', 'https://caniuse.com', 'tools', 298, 2, 100, 'https://caniuse.com/img/browserstack.svg'],
  ['This link is about to get removed', 'https://example.com/doomed', 'misc', 2, 6, 4, null],
]

if (!HOST.startsWith('127.0.0.1')) throw new Error('seed only ever runs against the emulator')

/*
 * The ages below are relative, so a run an hour later writes different documents and
 * every "3h ago" in a screenshot moves. SEED_NOW pins the instant the visual guard
 * pins its clock to, which is what makes the seeded board photographable at all.
 */
const now = process.env.SEED_NOW ? Date.parse(process.env.SEED_NOW) : Date.now()
if (Number.isNaN(now)) throw new Error(`SEED_NOW is not a date: ${process.env.SEED_NOW}`)

for (const [title, url, category, ups, downs, hoursOld, image] of SEED) {
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
        image: image ? { stringValue: image } : { nullValue: null },
      },
    }),
  })

  if (!response.ok) throw new Error(`${title}: ${response.status} ${await response.text()}`)
}

console.log(`seeded ${SEED.length} links into the emulator`)
