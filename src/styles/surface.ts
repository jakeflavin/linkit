import { css } from 'styled-components'

/**
 * The one raised plane the whole board is built from: every card, row, bar and
 * notice sits on it. It was a six-selector rule in the stylesheet, which is the
 * shape that made it easy to add a seventh surface and forget to list it.
 */
export const surface = css`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
`
