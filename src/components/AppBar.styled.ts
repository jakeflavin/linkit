import styled from 'styled-components'
import { hitArea } from '@/styles/touch'

export const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  height: var(--bar-height);
  background: var(--surface);
  border-bottom: 1px solid var(--line);
`

/** Matches Page exactly, so the actions land on the sidebar's right edge. */
export const Inner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  max-width: calc(var(--feed-width) + var(--rail-width) + var(--gutter) + 48px);
  margin: 0 auto;
  padding: 0 24px;

  /* The page narrows to the feed here, so the bar has to narrow with it or the
     actions stop lining up with the column below. */
  @media (max-width: 1000px) {
    max-width: var(--feed-width);
  }

  /* Same 8px gutter the page uses here, so the brand and the theme toggle line
     up with the edges of the cards below them. */
  @media (max-width: 640px) {
    padding: 0 8px;
    gap: 10px;
  }
`

/*
 * The brand and the actions each take exactly the room they need; the actions
 * are pushed to the bar's content edge, which is the edge the sidebar below
 * ends on. The search is centred independently of both (see Search), because
 * sharing a flex line with two sides of different widths either pulls it off
 * centre or squeezes the wordmark to nothing.
 */
export const Brand = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  padding: 0;
  background: none;
  color: inherit;

  ${hitArea}
`

export const Actions = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  margin-left: auto;
  justify-content: flex-end;
  gap: 4px;

  /* The theme toggle is chrome, not content. */
  @media print {
    display: none;
  }
`

export const BrandMark = styled.span`
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 50%;
  background: var(--up);
  position: relative;

  /* The mark is the upvote arrow itself, punched out of the orange disc. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 7px solid #fff;
    transform: translateY(-1px);
  }
`

export const BrandWord = styled.span`
  font-family: var(--font-head);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;

  @media (max-width: 640px) {
    display: none;
  }
`

/*
 * Taken out of the flex line and pinned to the middle of the bar, so it is
 * centred on the page at every width. The reserved 220px keeps it clear of the
 * brand and the actions as the bar narrows; below that it stops shrinking and
 * takes whatever is left instead.
 */
export const SearchBox = styled.label`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: min(560px, 100% - 220px);
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  background: var(--surface-2);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  color: var(--dim);

  &:focus-within {
    background: var(--surface);
    border-color: var(--accent);
    color: var(--text);
  }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: none;
    outline: none;
    color: var(--text);
    font-size: 15px;
  }

  input::-webkit-search-cancel-button {
    appearance: none;
  }

  /* No room to centre anything on a phone — the search takes what is left. */
  @media (max-width: 640px) {
    position: static;
    transform: none;
    width: auto;
    flex: 1 1 auto;
    min-width: 0;

    /* iOS zooms any input under 16px on focus. */
    input {
      font-size: 16px;
    }
  }

  /* Nothing to search on paper. */
  @media print {
    display: none;
  }
`
