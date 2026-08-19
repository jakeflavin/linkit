import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { Arrow, Rail, Score } from './VoteRail.styled'
import type { VoteDir } from '@/lib/types.ts'

interface VoteRailProps {
  score: number
  vote: VoteDir
  onVote: (dir: VoteDir) => void
  title: string
}

/** The arrows-and-score column down the left of every row. */
export function VoteRail({ score, vote, onVote, title }: VoteRailProps) {
  return (
    <Rail>
      <Arrow
        type="button"
        $cast={vote === 1}
        aria-pressed={vote === 1}
        aria-label={`Upvote ${title}`}
        onClick={() => onVote(1)}
      >
        <ArrowBigUp size={22} strokeWidth={1.75} />
      </Arrow>

      <Score $vote={vote} aria-live="polite">
        {formatScore(score)}
      </Score>

      <Arrow
        type="button"
        $down
        $cast={vote === -1}
        aria-pressed={vote === -1}
        aria-label={`Downvote ${title}`}
        onClick={() => onVote(-1)}
      >
        <ArrowBigDown size={22} strokeWidth={1.75} />
      </Arrow>
    </Rail>
  )
}

/*
 * Built once; constructing a formatter costs more than using one, and this runs per row.
 * Not Intl's own compact notation, deliberately: it is the locale-correct answer, but it
 * renders 1200 as "1,2 Tsd." in de, and this badge sits in a fixed-width rail beside the
 * arrows. The k stays, and Intl is left to do the part it is actually needed for — the
 * decimal mark, which was a hardcoded period before.
 */
const score1dp = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })

function formatScore(score: number): string {
  if (Math.abs(score) < 1000) return score1dp.format(score)
  return `${score1dp.format(score / 1000)}k`
}
