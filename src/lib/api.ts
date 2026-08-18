/**
 * Every Firestore read and write in the app. Components and hooks call these
 * by intent ("castVote") and never see a collection path.
 *
 * Shape:
 *   links/{linkId}                 the post and its tallies
 *   links/{linkId}/votes/{voterId} one doc per browser that voted
 */

import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase.ts'
import { domainOf, normalizeUrl } from './url.ts'
import { applyVote, isRemoved, resolveVote } from './ranking.ts'
import { voterId } from './identity.ts'
import type { Link, LinkDraft, VoteDir } from './types.ts'

const LINKS = 'links'
const VOTES = 'votes'

/** The board is a small, hand-curated list; one page covers it. */
const FEED_LIMIT = 500

export class ApiError extends Error {}

function requireDb() {
  if (!db) throw new ApiError('linkit is not connected to a database yet.')
  return db
}

function toLink(snap: QueryDocumentSnapshot<DocumentData>): Link {
  const d = snap.data()
  const url = typeof d.url === 'string' ? d.url : ''
  return {
    id: snap.id,
    url,
    title: typeof d.title === 'string' ? d.title : url,
    domain: typeof d.domain === 'string' ? d.domain : domainOf(url),
    category: typeof d.category === 'string' ? d.category : 'misc',
    // A pending serverTimestamp() reads as null on the writer's own snapshot.
    createdAt: typeof d.createdAt?.toMillis === 'function' ? d.createdAt.toMillis() : Date.now(),
    ups: typeof d.ups === 'number' ? d.ups : 0,
    downs: typeof d.downs === 'number' ? d.downs : 0,
  }
}

/**
 * Streams the whole board. Sorting, filtering, and search all happen on the
 * client (see `lib/ranking.ts`) so the feed needs no composite indexes and
 * re-ranks instantly as votes land.
 *
 * @returns an unsubscribe function.
 */
export function watchLinks(
  onLinks: (links: Link[]) => void,
  onError: (message: string) => void
): () => void {
  if (!db) {
    onLinks([])
    return () => {}
  }

  const q = query(collection(db, LINKS), orderBy('createdAt', 'desc'), limit(FEED_LIMIT))

  return onSnapshot(
    q,
    (snap) => onLinks(snap.docs.map(toLink)),
    () => onError('Could not reach the link database.')
  )
}

/** Rejects a duplicate before it is posted. */
export async function findByUrl(url: string): Promise<Link | null> {
  const database = requireDb()
  const snap = await getDocs(query(collection(database, LINKS), where('url', '==', url), limit(1)))
  return snap.empty ? null : toLink(snap.docs[0])
}

/**
 * Posts a link. The submitter's upvote is baked in — you vouch for what you
 * post, and it keeps a new link off the removal threshold.
 *
 * @returns the new link's id.
 * @throws ApiError if the URL is unusable or already on the board.
 */
export async function submitLink(draft: LinkDraft): Promise<string> {
  const database = requireDb()

  const url = normalizeUrl(draft.url)
  if (!url) throw new ApiError("That doesn't look like a web address.")

  const existing = await findByUrl(url)
  if (existing) throw new ApiError('Someone already posted that one.')

  const ref = doc(collection(database, LINKS))
  await setDoc(ref, {
    url,
    title: draft.title.trim(),
    domain: domainOf(url),
    category: draft.category,
    createdAt: serverTimestamp(),
    ups: 1,
    downs: 0,
  })

  // Recorded separately so the submitter's arrow shows as already cast.
  await setDoc(doc(database, LINKS, ref.id, VOTES, voterId()), {
    dir: 1,
    voter: voterId(),
    at: serverTimestamp(),
  })

  return ref.id
}

/**
 * Casts, changes, or clears this browser's vote, moving the tallies by the
 * same transaction so a link can never drift from its votes.
 *
 * Voting the same way twice clears the vote, as the arrows do on Reddit.
 */
export async function castVote(linkId: string, dir: VoteDir): Promise<void> {
  const database = requireDb()
  const linkRef = doc(database, LINKS, linkId)
  const voteRef = doc(database, LINKS, linkId, VOTES, voterId())

  await runTransaction(database, async (tx) => {
    const linkSnap = await tx.get(linkRef)
    if (!linkSnap.exists()) throw new ApiError('That link is gone.')

    const voteSnap = await tx.get(voteRef)
    const previous: VoteDir = voteSnap.exists() ? (voteSnap.data().dir as VoteDir) : 0
    const next = resolveVote(previous, dir)
    if (next === previous) return

    const data = linkSnap.data()
    tx.update(linkRef, applyVote({ ups: data.ups ?? 0, downs: data.downs ?? 0 }, previous, next))

    if (next === 0) tx.delete(voteRef)
    else tx.set(voteRef, { dir: next, voter: voterId(), at: serverTimestamp() })
  })
}

/**
 * This browser's existing votes, so the arrows survive a reload. One
 * collection-group query rather than a read per link — see
 * `firestore.indexes.json` for the index it needs.
 */
export async function loadMyVotes(): Promise<Record<string, VoteDir>> {
  if (!db) return {}

  const snap = await getDocs(
    query(collectionGroup(db, VOTES), where('voter', '==', voterId()), limit(FEED_LIMIT))
  )

  const votes: Record<string, VoteDir> = {}
  for (const voteDoc of snap.docs) {
    const linkId = voteDoc.ref.parent.parent?.id
    if (linkId) votes[linkId] = voteDoc.data().dir as VoteDir
  }
  return votes
}

/**
 * Deletes links the community has voted off the board. Any client may do
 * this; the security rules only permit it once the score is low enough, so
 * whoever notices first does the sweeping and no server is needed.
 *
 * Deleting a document does not delete its subcollection, so each sweeper also
 * clears its own vote doc — the only one it is allowed to touch. Other
 * voters' docs are collected when those browsers next see the same sweep.
 */
export async function sweepRemoved(links: readonly Link[]): Promise<void> {
  if (!db) return
  const database = db
  const me = voterId()

  await Promise.allSettled(
    links.filter(isRemoved).flatMap((link) => [
      deleteDoc(doc(database, LINKS, link.id, VOTES, me)),
      deleteDoc(doc(database, LINKS, link.id)),
    ])
  )
}
