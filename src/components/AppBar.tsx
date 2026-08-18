import { Moon, Search, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme.ts'

interface AppBarProps {
  query: string
  onQuery: (value: string) => void
  theme: Theme
  onToggleTheme: () => void
}

export function AppBar({ query, onQuery, theme, onToggleTheme }: AppBarProps) {
  return (
    <header className="appbar">
      <div className="appbar-inner">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-word">linkit</span>
        </a>

        <label className="search">
          <Search size={17} strokeWidth={2} />
          <input
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search linkit"
            aria-label="Search links"
          />
        </label>

        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
        >
          {theme === 'dark' ? (
            <Sun size={18} strokeWidth={2} />
          ) : (
            <Moon size={18} strokeWidth={2} />
          )}
        </button>
      </div>
    </header>
  )
}
