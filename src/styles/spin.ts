import { css, keyframes } from 'styled-components'

const turn = keyframes`
  to { transform: rotate(360deg); }
`

/**
 * Applied to the icon itself rather than a wrapper, which is where the class it
 * replaces sat — one of the two uses also carries the preview tile's glyph
 * styling, and a wrapper would have separated the two.
 */
export const spinning = css`
  animation: ${turn} 0.9s linear infinite;
`
