import { useState } from 'react'
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
    <div className={`thumb thumb-${mode}${image ? '' : ' is-fallback'}`} aria-hidden="true">
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
    </div>
  )
}

function FallbackMark({ domain }: { domain: string }) {
  const [failed, setFailed] = useState(false)

  if (!domain || failed) return <Link2 className="thumb-glyph" size={20} strokeWidth={2} />

  return (
    <img
      className="thumb-favicon"
      src={faviconFor(domain)}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
