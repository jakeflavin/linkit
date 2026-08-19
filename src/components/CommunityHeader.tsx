import { X } from 'lucide-react'
import { IconButton } from './buttons.styled'
import { Blurb, Count, Dot, Header, Name, Text } from './CommunityHeader.styled'
import { categoryOf } from '@/data/categories.ts'

interface CommunityHeaderProps {
  category: string
  count: number
  onClear: () => void
}

/** The banner that replaces the feed's top when one community is in focus. */
export function CommunityHeader({ category, count, onClear }: CommunityHeaderProps) {
  const { label, blurb, color } = categoryOf(category)

  return (
    <Header style={{ '--pill': color } as React.CSSProperties}>
      <Dot aria-hidden="true" />
      <Text>
        <Name>l/{label}</Name>
        <Blurb>{blurb}</Blurb>
      </Text>
      <Count>
        {count} {count === 1 ? 'link' : 'links'}
      </Count>
      <IconButton type="button" onClick={onClear} aria-label="Show every community">
        <X size={18} strokeWidth={2} />
      </IconButton>
    </Header>
  )
}
