/** Domain types shared across the app. Firestore shapes live here only. */

export interface Link {
  id: string
  /** Normalized absolute https URL. */
  url: string
  title: string
  /** Hostname without `www.`, denormalized so lists never re-parse the URL. */
  domain: string
  category: string
  createdAt: number
  ups: number
  downs: number
  /** og:image, resolved once when the link was posted. Null when it has none. */
  image: string | null
}

/** A link plus the values every list view derives from it. */
export interface RankedLink extends Link {
  score: number
  /** This browser's vote: 1, -1, or 0 for none. */
  vote: VoteDir
}

export type VoteDir = 1 | 0 | -1

export type SortKey = 'hot' | 'new' | 'top' | 'rising'

/** Fields a submitter provides; everything else is derived or counted. */
export interface LinkDraft {
  url: string
  title: string
  category: string
  image: string | null
}

/** How densely the feed draws its rows. */
export type ViewMode = 'compact' | 'card'
