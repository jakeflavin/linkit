import { css } from 'styled-components'

/**
 * A finger needs ~44px; the board's controls are sized for a mouse. Rather than
 * grow the glyphs, we grow the *hit area* on coarse pointers only, so nothing
 * changes on a desktop.
 *
 * `hitArea` centres a transparent 44×44 target over a control without touching
 * layout — for the vote arrows and small icon buttons packed into a rail, where
 * reflowing to 44px would break the column.
 */
export const hitArea = css`
  @media (pointer: coarse) {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 44px;
      height: 44px;
    }
  }
`

/**
 * `tallTarget` grows a control that lives in normal flow to a 44px minimum on
 * touch — the sort tabs, sidebar rows, and row actions, where a taller control
 * is fine and reflow is not a problem.
 */
export const tallTarget = css`
  @media (pointer: coarse) {
    min-height: 44px;
  }
`
