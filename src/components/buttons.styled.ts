import styled from 'styled-components'
import { spinning } from '@/styles/spin'
import { hitArea } from '@/styles/touch'

export const Button = styled.button<{ $primary?: boolean; $ghost?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 18px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  font-size: var(--font-body);
  font-weight: 700;

  ${(props) =>
    props.$primary &&
    `
    background: var(--accent);
    color: #fff;

    &:hover:not(:disabled) { background: var(--accent-hover); }
    &:disabled { opacity: 0.6; cursor: progress; }
  `}

  ${(props) =>
    props.$ghost &&
    `
    background: none;
    border-color: var(--accent-text);
    color: var(--accent-text);

    &:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
  `}
`

/**
 * The spinner is applied to the icon itself via `as`, because that is where the
 * class it replaces sat: one of the two uses also carries the preview tile's
 * glyph styling, and wrapping the icon would have separated the two.
 */
export const Spinner = styled.span`
  ${spinning}
`

/** The round icon control: the theme toggle, and the community header's clear. */
export const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--dim);

  ${hitArea}

  &:hover {
    background: var(--hover);
    color: var(--text);
  }
`
