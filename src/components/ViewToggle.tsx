import { Rows3, Square } from 'lucide-react'
import { Toggle, ViewButton } from './ViewToggle.styled'
import type { ViewMode } from '@/lib/types.ts'

const MODES: { key: ViewMode; label: string; Icon: typeof Rows3 }[] = [
  { key: 'compact', label: 'Compact view', Icon: Rows3 },
  { key: 'card', label: 'Card view', Icon: Square },
]

export function ViewToggle({ mode, onMode }: { mode: ViewMode; onMode: (mode: ViewMode) => void }) {
  return (
    <Toggle>
      {MODES.map(({ key, label, Icon }) => (
        <ViewButton
          key={key}
          type="button"
          $active={mode === key}
          aria-label={label}
          aria-pressed={mode === key}
          onClick={() => onMode(key)}
        >
          <Icon size={17} strokeWidth={2} />
        </ViewButton>
      ))}
    </Toggle>
  )
}
