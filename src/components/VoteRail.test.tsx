import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VoteRail } from './VoteRail.tsx'

const props = { vote: 0 as const, onVote: vi.fn(), title: 'A link' }
const decimal = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })

describe('VoteRail', () => {
  it('shows a small score as it is', () => {
    render(<VoteRail {...props} score={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('abbreviates a large score, with the reader’s decimal mark', () => {
    render(<VoteRail {...props} score={1200} />)
    expect(screen.getByText(`${decimal.format(1.2)}k`)).toBeInTheDocument()
  })

  it('drops a trailing zero rather than showing 1.0k', () => {
    render(<VoteRail {...props} score={1000} />)
    expect(screen.getByText('1k')).toBeInTheDocument()
  })

  it('abbreviates a large negative score too', () => {
    render(<VoteRail {...props} score={-1500} />)
    expect(screen.getByText(`${decimal.format(-1.5)}k`)).toBeInTheDocument()
  })

  it('announces the score as it changes, since voting does not move focus', () => {
    const { container } = render(<VoteRail {...props} score={5} />)
    expect(container.querySelector('.vote-score')).toHaveAttribute('aria-live', 'polite')
  })

  it('reports which way this browser voted on the arrows themselves', () => {
    render(<VoteRail {...props} score={5} vote={1} />)
    expect(screen.getByRole('button', { name: 'Upvote A link' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Downvote A link' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('passes the direction up rather than deciding the new score itself', async () => {
    const onVote = vi.fn()
    render(<VoteRail {...props} score={5} onVote={onVote} />)
    await userEvent.click(screen.getByRole('button', { name: 'Downvote A link' }))
    expect(onVote).toHaveBeenCalledWith(-1)
  })
})
