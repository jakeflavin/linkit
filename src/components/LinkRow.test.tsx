import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LinkRow } from './LinkRow.tsx'
import { REMOVAL_SCORE } from '@/lib/ranking.ts'
import type { RankedLink } from '@/lib/types.ts'

const link = (over: Partial<RankedLink> = {}): RankedLink => ({
  id: 'l1',
  url: 'https://example.com/a',
  title: 'A link',
  domain: 'example.com',
  category: 'tools',
  createdAt: Date.now(),
  ups: 3,
  downs: 0,
  image: null,
  score: 3,
  vote: 0,
  ...over,
})

const props = {
  rank: 1,
  saved: false,
  mode: 'card' as const,
  onVote: vi.fn(),
  onToggleSave: vi.fn(),
  onPickCategory: vi.fn(),
}

describe('LinkRow', () => {
  it('falls back to the compact layout when there is no image to show', () => {
    // Card view would otherwise render a 16:9 hole, which is most links.
    const { container } = render(<LinkRow {...props} link={link({ image: null })} />)
    expect(container.querySelector('.row-compact')).not.toBeNull()
  })

  it('uses the card layout when an image is available', () => {
    const { container } = render(
      <LinkRow {...props} link={link({ image: 'https://example.com/i.png' })} />,
    )
    expect(container.querySelector('.row-card')).not.toBeNull()
  })

  it('drops back to compact when the image fails to load', async () => {
    const { container } = render(
      <LinkRow {...props} link={link({ image: 'https://example.com/broken.png' })} />,
    )
    // The card image, not the favicon that also lives in this row.
    const img = container.querySelector<HTMLImageElement>('img[src*="broken"]')
    expect(img).not.toBeNull()
    fireEvent.error(img!)
    expect(await screen.findByRole('article')).toHaveClass('row-compact')
  })

  it('warns when a link is close to being removed', () => {
    render(<LinkRow {...props} link={link({ score: REMOVAL_SCORE + 2 })} />)
    expect(screen.getByText('on thin ice')).toBeInTheDocument()
  })

  it('says nothing about removal for a healthy link', () => {
    render(<LinkRow {...props} link={link({ score: REMOVAL_SCORE + 3 })} />)
    expect(screen.queryByText('on thin ice')).not.toBeInTheDocument()
  })

  it('reports the save state on the control rather than only in its label', () => {
    const onToggleSave = vi.fn()
    render(<LinkRow {...props} link={link()} saved onToggleSave={onToggleSave} />)
    const button = screen.getByRole('button', { name: /saved/i })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('asks its owner to toggle the save rather than deciding itself', async () => {
    const onToggleSave = vi.fn()
    render(<LinkRow {...props} link={link()} onToggleSave={onToggleSave} />)
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }))
    expect(onToggleSave).toHaveBeenCalledWith('l1')
  })
})
