/**
 * The communities a link can be posted to. Single source of truth for the
 * submit form, the sidebar, and the pill on every row — add a category here
 * and it appears in all three.
 */

export interface Category {
  id: string
  /** Displayed as `l/tools`, the way a subreddit reads. */
  label: string
  blurb: string
  /** Hue for the pill and sidebar dot. */
  color: string
}

export const CATEGORIES: readonly Category[] = [
  { id: 'tools', label: 'tools', blurb: 'Things that build, test, and ship software.', color: '#FF4500' },
  { id: 'learn', label: 'learn', blurb: 'Courses, books, and deep explainers.', color: '#0079D3' },
  { id: 'design', label: 'design', blurb: 'Interfaces, type, colour, and inspiration.', color: '#FF66AC' },
  { id: 'ai', label: 'ai', blurb: 'Models, agents, and the tooling around them.', color: '#7193FF' },
  { id: 'data', label: 'data', blurb: 'Open datasets, APIs, and dashboards.', color: '#00A6A5' },
  { id: 'reading', label: 'reading', blurb: 'Essays and writing worth the time.', color: '#DDBD37' },
  { id: 'fun', label: 'fun', blurb: 'Toys, oddities, and the good kind of useless.', color: '#94E044' },
  { id: 'money', label: 'money', blurb: 'Finance, pricing, and running a business.', color: '#46D160' },
  { id: 'health', label: 'health', blurb: 'Training, sleep, food, and evidence.', color: '#EA0027' },
  { id: 'misc', label: 'misc', blurb: 'Good links that fit nowhere else.', color: '#A5A4A4' },
]

export const CATEGORY_IDS: readonly string[] = CATEGORIES.map((c) => c.id)

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))

/** Never returns undefined — unknown ids fall back to misc. */
export function categoryOf(id: string): Category {
  return BY_ID.get(id) ?? BY_ID.get('misc')!
}
