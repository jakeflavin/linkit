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
  onHome: () => void
}

export function AppBar({ query, onQuery, theme, onToggleTheme, onHome }: AppBarProps) {
  return (
    <Bar>
      <Inner>
        {/* The wordmark is the board's home: it clears the filters rather than
            leaving for the directory, which opened this app in its own tab. */}
        <Brand type="button" onClick={onHome} aria-label="linkit — back to the top of the board">
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
