import styled from 'styled-components'

/**
 * The fallback favicon sits at its own size, centred over the link glyph. It is
 * a background image, not an <img>, so a domain whose favicon 404s reveals the
 * glyph beneath without logging a console error.
 */
export const Favicon = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 3px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

/** Applied to the icon itself, so it also serves the compose form's spinner. */
export const Glyph = styled.span`
  opacity: 0.7;
`

/**
 * The thumbnail is a fixed box the image is cropped into, so a row's height
 * never depends on what a site happens to serve.
 */
export const Tile = styled.div<{ $card?: boolean; $fallback?: boolean }>`
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--surface-2);
  border: 1px solid var(--line-soft);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  ${(props) =>
    props.$fallback &&
    `
    position: relative;
    display: grid;
    place-items: center;
    color: var(--dim);
  `}

  ${(props) =>
    props.$card
      ? `
    width: 100%;
    aspect-ratio: 16 / 9;
    max-height: 320px;
  `
      : `
    width: 76px;
    height: 76px;
    flex: none;

    /* A 76px tile is a third of a phone's width; the row needs the space more. */
    @media (max-width: 640px) {
      width: 56px;
      height: 56px;
    }
  `}

  /* The tile sets the favicon's size, which is why it beat the favicon's own
     rule with !important when both were classes. */
  ${Favicon} {
    width: ${(props) => (props.$card ? '40px' : '24px')};
    height: ${(props) => (props.$card ? '40px' : '24px')};
  }
`
