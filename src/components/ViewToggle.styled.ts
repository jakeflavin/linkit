import styled from 'styled-components'
import { hitArea } from '@/styles/touch'

export const Toggle = styled.div`
  display: flex;
  gap: 2px;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid var(--line-soft);

  /* Last cell of the sort bar's second row, sitting on the grid's right edge. */
  @media (max-width: 640px) {
    justify-self: end;
    margin-left: 0;
    padding-left: 0;
    border-left: 0;
  }
`

export const ViewButton = styled.button<{ $active?: boolean }>`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: var(--radius);
  background: none;
  color: var(--dim);

  ${hitArea}

  &:hover {
    background: var(--hover);
    color: var(--text);
  }

  ${(props) =>
    props.$active &&
    `
    && {
      background: var(--hover);
      color: var(--accent-text);
    }
  `}
`
