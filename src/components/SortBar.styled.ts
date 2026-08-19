import styled from 'styled-components'
import { surface } from '@/styles/surface'

export const Bar = styled.div`
  ${surface}
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;

  /*
   * Two rows of three rather than a sideways scroll, which hides whatever does
   * not fit and is awkward to work with a thumb. Six controls into a 3x2 grid
   * divides evenly, so every cell is filled and the rows line up — wrapping
   * instead left Saved and the toggle marooned either side of a 200px hole.
   * Three to a row also leaves room to keep the icons.
   */
  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
    padding: 8px;
  }
`

export const Tab = styled.button<{ $active?: boolean; $saved?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--radius-pill);
  background: none;
  color: var(--dim);
  font-weight: 700;

  &:hover {
    background: var(--hover);
    color: var(--text);
  }

  ${(props) =>
    props.$active &&
    `
    && {
      background: var(--hover);
      color: var(--accent);
    }
  `}

  /* Saved is pushed to the far end, away from the four sorts. */
  ${(props) => props.$saved && 'margin-left: auto;'}

  @media (max-width: 640px) {
    justify-content: center;
    padding: 0 6px;
    ${(props) => props.$saved && 'margin-left: 0;'}
  }
`

export const Count = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-pill);
  background: var(--accent);
  color: #fff;
  font-size: 11px;
`
