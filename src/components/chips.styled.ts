import styled, { css } from 'styled-components'

/**
 * One shape with two jobs: a Pill labels the community a link is in, a Chip is
 * the same thing made selectable in the compose form. Both take their colour
 * from a `--pill` custom property the caller sets per community.
 */
const pill = css`
  --pill: var(--dim);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  background: var(--surface);
  font-size: var(--font-meta);
  font-weight: 600;
  color: var(--dim);

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--pill);
  }

  &:hover {
    color: var(--text);
    border-color: var(--pill);
  }
`

export const Pill = styled.button`
  ${pill}
`

export const Chip = styled.button<{ $on?: boolean }>`
  ${pill}

  ${(props) =>
    props.$on &&
    `
    border-color: var(--pill);
    background: color-mix(in srgb, var(--pill) 14%, var(--surface));
    color: var(--text);
  `}
`

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`
