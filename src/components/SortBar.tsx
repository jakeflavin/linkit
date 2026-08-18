import { Clock, Flame, Sparkles, TrendingUp } from 'lucide-react'
import type { SortKey } from '../lib/types.ts'

const TABS: { key: SortKey; label: string; Icon: typeof Flame }[] = [
  { key: 'hot', label: 'Hot', Icon: Flame },
  { key: 'new', label: 'New', Icon: Sparkles },
  { key: 'top', label: 'Top', Icon: TrendingUp },
  { key: 'rising', label: 'Rising', Icon: Clock },
]

interface SortBarProps {
  sort: SortKey
  onSort: (sort: SortKey) => void
  savedOnly: boolean
  savedCount: number
  onToggleSaved: () => void
}

export function SortBar({ sort, onSort, savedOnly, savedCount, onToggleSaved }: SortBarProps) {
  return (
    <div className="sort-bar" role="tablist" aria-label="Sort links">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={sort === key && !savedOnly}
          className={`sort-tab${sort === key && !savedOnly ? ' is-active' : ''}`}
          onClick={() => onSort(key)}
        >
          <Icon size={18} strokeWidth={2} />
          {label}
        </button>
      ))}

      <button
        type="button"
        className={`sort-tab saved${savedOnly ? ' is-active' : ''}`}
        aria-pressed={savedOnly}
        onClick={onToggleSaved}
      >
        Saved
        {savedCount > 0 && <span className="sort-count">{savedCount}</span>}
      </button>
    </div>
  )
}
