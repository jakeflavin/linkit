import { X } from 'lucide-react'
import { categoryOf } from '../data/categories.ts'

interface CommunityHeaderProps {
  category: string
  count: number
  onClear: () => void
}

/** The banner that replaces the feed's top when one community is in focus. */
export function CommunityHeader({ category, count, onClear }: CommunityHeaderProps) {
  const { label, blurb, color } = categoryOf(category)

  return (
    <section className="community-header" style={{ '--pill': color } as React.CSSProperties}>
      <span className="community-header-dot" aria-hidden="true" />
      <div className="community-header-text">
        <h1 className="community-header-name">l/{label}</h1>
        <p className="community-header-blurb">{blurb}</p>
      </div>
      <span className="community-header-count">
        {count} {count === 1 ? 'link' : 'links'}
      </span>
      <button
        type="button"
        className="icon-btn"
        onClick={onClear}
        aria-label="Show every community"
      >
        <X size={18} strokeWidth={2} />
      </button>
    </section>
  )
}
