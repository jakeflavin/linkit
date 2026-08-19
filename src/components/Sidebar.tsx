import { CATEGORIES } from '@/data/categories.ts'
import {
  About,
  Communities,
  Community,
  Count,
  Dot,
  Name,
  Rail,
  Rules,
  Stats,
} from './Sidebar.styled'
import { CardTitle } from './cards.styled'
import { REMOVAL_SCORE } from '@/lib/ranking.ts'
import type { Link } from '@/lib/types.ts'

interface SidebarProps {
  links: readonly Link[]
  active: string | null
  onPick: (category: string | null) => void
}

export function Sidebar({ links, active, onPick }: SidebarProps) {
  const counts = new Map<string, number>()
  for (const link of links) counts.set(link.category, (counts.get(link.category) ?? 0) + 1)

  return (
    <Rail>
      <About>
        <CardTitle>About linkit</CardTitle>
        <p>
          An anonymous board of links worth keeping. No accounts, no profiles — post what you find,
          and the votes decide what stays.
        </p>
        <Stats>
          <div>
            <dt>Links</dt>
            <dd>{links.length}</dd>
          </div>
          <div>
            <dt>Communities</dt>
            <dd>{CATEGORIES.length}</dd>
          </div>
        </Stats>
      </About>

      <Communities aria-label="Communities">
        <CardTitle>Communities</CardTitle>
        <Community
          type="button"
          $active={active === null}
          aria-label={`All communities, ${links.length} links`}
          onClick={() => onPick(null)}
        >
          <Dot $all aria-hidden="true" />
          <Name>All</Name>
          <Count>{links.length}</Count>
        </Community>

        {CATEGORIES.map((category) => (
          <Community
            key={category.id}
            type="button"
            $active={active === category.id}
            aria-label={`l/${category.label}, ${counts.get(category.id) ?? 0} links`}
            onClick={() => onPick(category.id)}
          >
            <Dot style={{ background: category.color }} aria-hidden="true" />
            <Name>l/{category.label}</Name>
            <Count>{counts.get(category.id) ?? 0}</Count>
          </Community>
        ))}
      </Communities>

      <Rules>
        <CardTitle>How it works</CardTitle>
        <ol>
          <li>Post a link and it starts with your upvote.</li>
          <li>Anyone can vote it up or down — one vote per browser.</li>
          <li>
            Hit <strong>{REMOVAL_SCORE}</strong> and the community deletes it for good.
          </li>
        </ol>
      </Rules>
    </Rail>
  )
}
