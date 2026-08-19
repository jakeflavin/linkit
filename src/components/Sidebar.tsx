import { CATEGORIES } from '@/data/categories.ts'
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
    <aside className="sidebar">
      <section className="card about">
        <h2 className="card-title">About linkit</h2>
        <p>
          An anonymous board of links worth keeping. No accounts, no profiles — post what you find,
          and the votes decide what stays.
        </p>
        <dl className="stats">
          <div>
            <dt>Links</dt>
            <dd>{links.length}</dd>
          </div>
          <div>
            <dt>Communities</dt>
            <dd>{CATEGORIES.length}</dd>
          </div>
        </dl>
      </section>

      <nav className="card communities" aria-label="Communities">
        <h2 className="card-title">Communities</h2>
        <button
          type="button"
          className={`community${active === null ? ' is-active' : ''}`}
          aria-label={`All communities, ${links.length} links`}
          onClick={() => onPick(null)}
        >
          <span className="community-dot all" aria-hidden="true" />
          <span className="community-name">All</span>
          <span className="community-count">{links.length}</span>
        </button>

        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`community${active === category.id ? ' is-active' : ''}`}
            aria-label={`l/${category.label}, ${counts.get(category.id) ?? 0} links`}
            onClick={() => onPick(category.id)}
          >
            <span
              className="community-dot"
              style={{ background: category.color }}
              aria-hidden="true"
            />
            <span className="community-name">l/{category.label}</span>
            <span className="community-count">{counts.get(category.id) ?? 0}</span>
          </button>
        ))}
      </nav>

      <section className="card rules">
        <h2 className="card-title">How it works</h2>
        <ol>
          <li>Post a link and it starts with your upvote.</li>
          <li>Anyone can vote it up or down — one vote per browser.</li>
          <li>
            Hit <strong>{REMOVAL_SCORE}</strong> and the community deletes it for good.
          </li>
        </ol>
      </section>
    </aside>
  )
}
