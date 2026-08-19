import styled from 'styled-components'
import { Card, CardTitle } from './cards.styled'

export const Rail = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: start;
  position: sticky;
  top: calc(var(--bar-height) + 20px);

  /* The rail becomes a footer section rather than disappearing. */
  @media (max-width: 1000px) {
    position: static;
  }
`

export const About = styled(Card)`
  p {
    margin: 0 0 12px;
    color: var(--dim);
  }
`

export const Stats = styled.dl`
  display: flex;
  gap: 24px;
  margin: 0;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);

  dt {
    font-size: var(--font-meta);
    color: var(--dim);
  }

  dd {
    margin: 0;
    font-family: var(--font-head);
    font-size: 17px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`

/** The list is its own nav, and its title sits flush with the rows below it. */
export const Communities = styled(Card).attrs({ as: 'nav' })`
  padding: 12px 8px 8px;

  ${CardTitle} {
    padding: 0 8px;
  }
`

export const Community = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 0;
  border-radius: var(--radius);
  background: none;
  text-align: left;

  &:hover {
    background: var(--hover);
  }

  ${(props) =>
    props.$active &&
    `
    && {
      background: var(--hover);
      color: var(--accent);
      font-weight: 700;
    }
  `}
`

export const Dot = styled.span<{ $all?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;

  ${(props) => props.$all && 'background: linear-gradient(135deg, var(--up), var(--down));'}
`

export const Name = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Count = styled.span`
  font-size: var(--font-meta);
  color: var(--dim);
  font-variant-numeric: tabular-nums;
`

export const Rules = styled(Card)`
  ol {
    margin: 0;
    padding-left: 18px;
    color: var(--dim);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`
