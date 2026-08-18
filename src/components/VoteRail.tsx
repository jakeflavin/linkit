import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import type { VoteDir } from '../lib/types.ts'

interface VoteRailProps {
  score: number
  vote: VoteDir
  onVote: (dir: VoteDir) => void
  title: string
}

/** The arrows-and-score column down the left of every row. */
export function VoteRail({ score, vote, onVote, title }: VoteRailProps) {
  return (
    <div className="vote-rail">
      <button
        type="button"
        className={`vote-arrow up${vote === 1 ? ' is-cast' : ''}`}
        aria-pressed={vote === 1}
        aria-label={`Upvote ${title}`}
        onClick={() => onVote(1)}
      >
        <ArrowBigUp size={22} strokeWidth={1.75} />
      </button>

      <span
        className={`vote-score${vote === 1 ? ' is-up' : ''}${vote === -1 ? ' is-down' : ''}`}
        aria-live="polite"
      >
        {formatScore(score)}
      </span>

      <button
        type="button"
        className={`vote-arrow down${vote === -1 ? ' is-cast' : ''}`}
        aria-pressed={vote === -1}
        aria-label={`Downvote ${title}`}
        onClick={() => onVote(-1)}
      >
        <ArrowBigDown size={22} strokeWidth={1.75} />
      </button>
    </div>
  )
}

function formatScore(score: number): string {
  if (Math.abs(score) < 1000) return String(score)
  return `${(score / 1000).toFixed(1).replace(/\.0$/, '')}k`
}
