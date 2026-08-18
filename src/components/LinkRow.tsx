import { useState } from 'react'
import { Bookmark, BookmarkCheck, Link2, SquareArrowOutUpRight } from 'lucide-react'
import { VoteRail } from './VoteRail.tsx'
import { categoryOf } from '../data/categories.ts'
import { faviconFor } from '../lib/url.ts'
import { timeAgo } from '../lib/time.ts'
import { REMOVAL_SCORE } from '../lib/ranking.ts'
import type { RankedLink, VoteDir } from '../lib/types.ts'

interface LinkRowProps {
  link: RankedLink
  rank: number
  saved: boolean
  onVote: (id: string, dir: VoteDir) => void
  onToggleSave: (id: string) => void
  onPickCategory: (id: string) => void
}

export function LinkRow({
  link,
  rank,
  saved,
  onVote,
  onToggleSave,
  onPickCategory,
}: LinkRowProps) {
  const [copied, setCopied] = useState(false)
  const category = categoryOf(link.category)
  const atRisk = link.score <= REMOVAL_SCORE + 2

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link.url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard denied — the link is still visible and clickable.
    }
  }

  return (
    <article className="row">
      <span className="row-rank" aria-hidden="true">
        {rank}
      </span>

      <VoteRail
        score={link.score}
        vote={link.vote}
        title={link.title}
        onVote={(dir) => onVote(link.id, dir)}
      />

      <div className="row-body">
        <div className="row-meta">
          <button
            type="button"
            className="pill"
            style={{ '--pill': category.color } as React.CSSProperties}
            onClick={() => onPickCategory(category.id)}
          >
            l/{category.label}
          </button>
          <span className="row-dot" aria-hidden="true">
            •
          </span>
          <span className="row-time">{timeAgo(link.createdAt)}</span>
          {atRisk && <span className="row-warning">on thin ice</span>}
        </div>

        <h2 className="row-title">
          <a href={link.url} target="_blank" rel="noopener noreferrer nofollow">
            {link.title}
          </a>
        </h2>

        <a
          className="row-domain"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <img src={faviconFor(link.domain)} alt="" width={16} height={16} loading="lazy" />
          {link.domain}
          <SquareArrowOutUpRight size={11} strokeWidth={2} />
        </a>

        <div className="row-actions">
          <button type="button" className="row-action" onClick={copy}>
            <Link2 size={16} strokeWidth={1.75} />
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <button
            type="button"
            className={`row-action${saved ? ' is-on' : ''}`}
            aria-pressed={saved}
            onClick={() => onToggleSave(link.id)}
          >
            {saved ? (
              <BookmarkCheck size={16} strokeWidth={1.75} />
            ) : (
              <Bookmark size={16} strokeWidth={1.75} />
            )}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  )
}
