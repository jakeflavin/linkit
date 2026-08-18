import { useEffect } from 'react'
import { usePersistentState } from './usePersistentState.ts'

export type Theme = 'light' | 'dark'

/** Theme choice, persisted and reflected onto <html data-theme>. */
export function useTheme() {
  const [theme, setTheme] = usePersistentState<Theme>('linkit:theme', prefersDark())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}

function prefersDark(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
