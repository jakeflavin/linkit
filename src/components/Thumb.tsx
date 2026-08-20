import { Favicon, Glyph, Tile } from './Thumb.styled'
import { Link2 } from 'lucide-react'
import { faviconFor } from '@/lib/url.ts'
import type { ViewMode } from '@/lib/types.ts'

interface ThumbProps {
  image: string | null
  domain: string
  mode: ViewMode
  /** Told when the preview image itself fails, so a card row can go compact. */
  onImageError?: () => void
}

/**
 * A link's preview image, or the tile that stands in for one.
 *
 * Plenty of links have no og:image and plenty of og:images 404 or block
 * hotlinking, so the fallback is not an edge case — it is the second half of
 * the design. It shows the site's favicon on a plain tile, which reads as
 * deliberate rather than broken.
 */
export function Thumb({ image, domain, mode, onImageError }: ThumbProps) {
  return (
    <Tile $card={mode === 'card'} $fallback={!image} aria-hidden="true">
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          // Some hosts serve a placeholder or 403 when the referrer is foreign.
          referrerPolicy="no-referrer"
          onError={onImageError}
        />
      ) : (
        <FallbackMark domain={domain} />
      )}
    </Tile>
  )
}

/**
 * The link glyph is always drawn; the favicon is laid over it as a background
 * image, so a domain with no favicon simply reveals the glyph beneath — and a
 * failed fetch is silent, where an <img> onError logged a console 404 for every
 * favicon-less link (Google's service 404s rather than returning its globe).
 */
function FallbackMark({ domain }: { domain: string }) {
  return (
    <>
      <Glyph as={Link2} size={20} strokeWidth={2} />
      {domain && (
        <Favicon aria-hidden="true" style={{ backgroundImage: `url("${faviconFor(domain)}")` }} />
      )}
    </>
  )
}
