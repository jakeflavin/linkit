import { useEffect, useState } from 'react'
import { castVote, loadMyVotes, submitLink, sweepRemoved, watchLinks } from '../lib/api.ts'
import { isRemoved } from '../lib/ranking.ts'
import type { Link, LinkDraft, VoteDir } from '../lib/types.ts'

/**
 * The board: the live link list, this browser's votes, and the vote action.
 *
 * Votes are applied optimistically so an arrow never lags a click; the
 * snapshot that follows is authoritative and overwrites the guess.
 */
export function useLinks() {
  const [links, setLinks] = useState<Link[]>([])
  const [votes, setVotes] = useState<Record<string, VoteDir>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = watchLinks(
      (next) => {
        setLinks(next)
        setLoading(false)
        setError(null)
        // Whoever is looking clears out what the community has voted down.
        if (next.some(isRemoved)) void sweepRemoved(next)
      },
      (message) => {
        setError(message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    let live = true
    loadMyVotes()
      .then((mine) => {
        if (live) setVotes(mine)
      })
      .catch(() => {
        // Arrows just start empty; voting still works.
      })
    return () => {
      live = false
    }
  }, [])

  const vote = async (linkId: string, dir: VoteDir) => {
    const previous = votes[linkId] ?? 0
    const next: VoteDir = previous === dir ? 0 : dir

    setVotes((current) => ({ ...current, [linkId]: next }))
    setLinks((current) =>
      current.map((link) =>
        link.id === linkId
          ? {
              ...link,
              ups: link.ups + (next === 1 ? 1 : 0) - (previous === 1 ? 1 : 0),
              downs: link.downs + (next === -1 ? 1 : 0) - (previous === -1 ? 1 : 0),
            }
          : link
      )
    )

    try {
      await castVote(linkId, dir)
    } catch {
      setVotes((current) => ({ ...current, [linkId]: previous }))
      setError('That vote did not stick. Try again.')
    }
  }

  /** Posting counts as an upvote, so the new row shows the arrow already cast. */
  const submit = async (draft: LinkDraft) => {
    const id = await submitLink(draft)
    setVotes((current) => ({ ...current, [id]: 1 }))
  }

  return { links, votes, loading, error, vote, submit }
}
