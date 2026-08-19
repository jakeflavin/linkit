import styled from 'styled-components'
import { surface } from '@/styles/surface'
import { Pill } from './chips.styled'

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

/**
 * The rank, the vote rail, and then either a thumbnail beside the body or the
 * body alone with the image inside it.
 */
export const Row = styled.article<{ $card?: boolean }>`
  ${surface}
  display: grid;
  align-items: stretch;
  overflow: hidden;

  &:hover {
    border-color: var(--dim);
  }

  ${(props) =>
    props.$card
      ? `
    grid-template-columns: 28px 40px minmax(0, 1fr);

    @media (max-width: 640px) { grid-template-columns: 36px minmax(0, 1fr); }
  `
      : `
    grid-template-columns: 28px 40px auto minmax(0, 1fr);

    @media (max-width: 640px) { grid-template-columns: 36px auto minmax(0, 1fr); }
  `}
`

export const Rank = styled.span`
  display: grid;
  place-items: center;
  background: var(--rail);
  color: var(--dim);
  font-size: var(--font-meta);
  font-weight: 600;
  font-variant-numeric: tabular-nums;

  /* No room for both a rank and a rail; the arrows win. */
  @media (max-width: 640px) {
    display: none;
  }
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px 6px;
  min-width: 0;
`

export const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-meta);
  color: var(--dim);
  flex-wrap: wrap;

  /* Inside a row the community reads as a label, not as a control to press. */
  ${Pill} {
    height: 20px;
    padding: 0 8px;
    border-color: transparent;
    background: none;
  }
`

export const Warning = styled.span`
  color: var(--up);
  font-weight: 600;
`

export const Title = styled.h2`
  font-size: var(--font-title);
  font-weight: 500;
  text-wrap: pretty;

  a:hover {
    color: var(--accent);
  }

  a:visited {
    color: var(--dim);
  }

  @media (max-width: 640px) {
    font-size: 16px;
  }
`

export const Domain = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  max-width: 100%;
  font-size: var(--font-meta);
  color: var(--accent);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  img {
    border-radius: 2px;
    flex: none;
  }

  &:hover {
    text-decoration: underline;
  }
`

export const ThumbLink = styled.a`
  display: block;
  align-self: center;
  padding: 8px 0 8px 10px;

  @media (max-width: 640px) {
    padding-left: 8px;
  }
`

export const HeroLink = styled.a`
  display: block;
  margin: 6px 0 2px;
`

export const Actions = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 2px;
`

export const Action = styled.button<{ $on?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 8px;
  border: 0;
  border-radius: 2px;
  background: none;
  color: var(--dim);
  font-size: var(--font-meta);
  font-weight: 700;

  &:hover {
    background: var(--hover);
    color: var(--text);
  }

  ${(props) => props.$on && 'color: var(--accent);'}
`
