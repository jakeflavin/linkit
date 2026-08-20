import { Clock, Flame, Sparkles, TrendingUp } from 'lucide-react'
import { Bar, Count, Tab } from './SortBar.styled'
import type { SortKey } from '@/lib/types.ts'

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
  viewToggle: React.ReactNode
}

export function SortBar({
  sort,
  onSort,
  savedOnly,
  savedCount,
  onToggleSaved,
  viewToggle,
}: SortBarProps) {
  return (
    <Bar role="group" aria-label="Sort and filter links">
      {TABS.map(({ key, label, Icon }) => (
        <Tab
          key={key}
          type="button"
          aria-pressed={sort === key && !savedOnly}
          $active={sort === key && !savedOnly}
          onClick={() => onSort(key)}
        >
          <Icon size={18} strokeWidth={2} />
          {label}
        </Tab>
      ))}

      <Tab type="button" $saved $active={savedOnly} aria-pressed={savedOnly} onClick={onToggleSaved}>
        Saved
        {savedCount > 0 && <Count>{savedCount}</Count>}
      </Tab>

      {viewToggle}
    </Bar>
  )
}
