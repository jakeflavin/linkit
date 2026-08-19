import styled from 'styled-components'

/** Takes its accent from a `--pill` the caller sets for the community shown. */
export const Header = styled.section`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  border-top: 3px solid var(--pill);
`

export const Dot = styled.span`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  background: var(--pill);
`

export const Text = styled.div`
  flex: 1;
  min-width: 0;
`

export const Name = styled.h1`
  font-size: 17px;
  font-weight: 700;
`

export const Blurb = styled.p`
  margin: 0;
  font-size: var(--font-meta);
  color: var(--dim);
`

export const Count = styled.span`
  flex: none;
  font-size: var(--font-meta);
  color: var(--dim);
  font-variant-numeric: tabular-nums;
`
