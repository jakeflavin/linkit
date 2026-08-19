import { Moon, Search, Sun } from 'lucide-react'
import type { Theme } from '@/hooks/useTheme.ts'
import {
  Actions,
  Bar,
  Brand,
  BrandMark,
  BrandWord,
  Inner,
  SearchBox,
} from './AppBar.styled'
import { IconButton } from './buttons.styled'

interface AppBarProps {
  query: string
  onQuery: (value: string) => void
  theme: Theme
  onToggleTheme: () => void
}

export function AppBar({ query, onQuery, theme, onToggleTheme }: AppBarProps) {
  return (
    <Bar>
      <Inner>
        <Brand href="/">
          <BrandMark aria-hidden="true" />
          <BrandWord>linkit</BrandWord>
        </Brand>

        <SearchBox>
          <Search size={17} strokeWidth={2} />
          <input
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search linkit"
            aria-label="Search links"
          />
        </SearchBox>

        <Actions>
          <IconButton
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
          >
            {theme === 'dark' ? (
              <Sun size={18} strokeWidth={2} />
            ) : (
              <Moon size={18} strokeWidth={2} />
            )}
          </IconButton>
        </Actions>
      </Inner>
    </Bar>
  )
}
