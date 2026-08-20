import { useState } from 'react'
import {
  Action,
  Actions,
  Body,
  Domain,
  DomainIcon,
  HeroLink,
  Meta,
  Rank,
  Row,
  Title,
  ThumbLink,
  Warning,
} from './LinkRow.styled'
import { Pill } from './chips.styled'
import { Bookmark, BookmarkCheck, Link2, SquareArrowOutUpRight } from 'lucide-react'
import { VoteRail } from './VoteRail.tsx'
import { Thumb } from './Thumb.tsx'
import { categoryOf } from '@/data/categories.ts'
import { faviconFor } from '@/lib/url.ts'
import { timeAgo } from '@/lib/time.ts'
import { REMOVAL_SCORE } from '@/lib/ranking.ts'
import type { RankedLink, ViewMode, VoteDir } from '@/lib/types.ts'

interface LinkRowProps {
  link: RankedLink
  rank: number
  saved: boolean
  mode: ViewMode
  onVote: (id: string, dir: VoteDir) => void
  onToggleSave: (id: string) => void
  onPickCategory: (id: string) => void
}

export function LinkRow({
  link,
  rank,
  saved,
  mode,
  onVote,
  onToggleSave,
  onPickCategory,
}: LinkRowProps) {
  const [copied, setCopied] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const category = categoryOf(link.category)

  const image = imageFailed ? null : link.image

  // Card view only earns its space when there is an image to show. Without a
  // usable one it would be a 16:9 hole, and most links either have no
  // og:image or serve one that fails — so those rows stay compact and the
  // feed never grows empty boxes.
  const layout: ViewMode = mode === 'card' && image ? 'card' : 'compact'
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
    <Row $card={layout === 'card'} data-layout={layout}>
      <Rank aria-hidden="true">
        {rank}
      </Rank>

      <VoteRail
        score={link.score}
        vote={link.vote}
        title={link.title}
        onVote={(dir) => onVote(link.id, dir)}
      />

      {layout === 'compact' && (
        <ThumbLink
          href={link.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          tabIndex={-1}
        >
          <Thumb
            image={image}
            domain={link.domain}
            mode="compact"
            onImageError={() => setImageFailed(true)}
          />
        </ThumbLink>
      )}

      <Body>
        <Meta>
          <Pill
            type="button"
            style={{ '--pill': category.color } as React.CSSProperties}
            onClick={() => onPickCategory(category.id)}
          >
            l/{category.label}
          </Pill>
          <span aria-hidden="true">
            •
          </span>
          <span>{timeAgo(link.createdAt)}</span>
          {atRisk && <Warning>on thin ice</Warning>}
        </Meta>

        <Title>
          <a href={link.url} target="_blank" rel="noopener noreferrer nofollow">
            {link.title}
          </a>
        </Title>

        <Domain href={link.url} target="_blank" rel="noopener noreferrer nofollow">
          <DomainIcon aria-hidden="true" style={{ backgroundImage: `url("${faviconFor(link.domain)}")` }} />
          {link.domain}
          <SquareArrowOutUpRight size={11} strokeWidth={2} />
        </Domain>

        {layout === 'card' && (
          <HeroLink
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            tabIndex={-1}
          >
            <Thumb
              image={image}
              domain={link.domain}
              mode="card"
              onImageError={() => setImageFailed(true)}
            />
          </HeroLink>
        )}

        <Actions>
          <Action type="button" onClick={copy}>
            <Link2 size={16} strokeWidth={1.75} />
            {copied ? 'Copied' : 'Copy link'}
          </Action>
          <Action
            type="button"
            $on={saved}
            aria-pressed={saved}
            onClick={() => onToggleSave(link.id)}
          >
            {saved ? (
              <BookmarkCheck size={16} strokeWidth={1.75} />
            ) : (
              <Bookmark size={16} strokeWidth={1.75} />
            )}
            {saved ? 'Saved' : 'Save'}
          </Action>
        </Actions>
      </Body>
    </Row>
  )
}
