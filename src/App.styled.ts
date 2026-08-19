import styled from 'styled-components'

/**
 * The feed and the rail, centred together. Below 1000px the rail stops being a
 * column and becomes a section under the feed, so the grid drops to one track.
 */
export const Page = styled.main`
  display: grid;
  grid-template-columns: minmax(0, var(--feed-width)) var(--rail-width);
  gap: var(--gutter);
  justify-content: center;
  max-width: calc(var(--feed-width) + var(--rail-width) + var(--gutter) + 48px);
  margin: 0 auto;
  padding: 20px 24px 48px;

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr);
    max-width: var(--feed-width);
  }

  @media (max-width: 640px) {
    padding: 12px 8px 32px;
  }
`

export const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`

export const Footer = styled.footer`
  padding: 0 24px 32px;
  text-align: center;
  font-size: var(--font-meta);
  color: var(--dim);
`
