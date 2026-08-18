import { useCallback, useState } from 'react'

/**
 * useState that survives reloads. Storage failures (private mode, quota) are
 * swallowed — the value still works for this session.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = next instanceof Function ? next(previous) : next
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // Not being able to persist is not worth failing the interaction.
        }
        return resolved
      })
    },
    [key]
  )

  return [value, update] as const
}
