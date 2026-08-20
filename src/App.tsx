import { useEffect, useMemo, useRef, useState } from 'react'
import { Feed, Footer, Page } from './App.styled'
import { Rows } from './components/LinkRow.styled'
import { AppBar } from './components/AppBar.tsx'
import { Sidebar } from './components/Sidebar.tsx'
import { SortBar } from './components/SortBar.tsx'
import { ViewToggle } from './components/ViewToggle.tsx'
import { SubmitCard } from './components/SubmitCard.tsx'
import { LinkRow } from './components/LinkRow.tsx'
import { Banner, EmptyFeed, FeedSkeleton } from './components/Notice.tsx'
import { CommunityHeader } from './components/CommunityHeader.tsx'
import { useLinks } from './hooks/useLinks.ts'
import { useTheme } from './hooks/useTheme.ts'
import { usePersistentState } from './hooks/usePersistentState.ts'
import { matchesQuery, rankLinks } from './lib/ranking.ts'
import { isConfigured } from './firebase.ts'
import { CATEGORY_IDS } from './data/categories.ts'
import type { SortKey, ViewMode } from './lib/types.ts'

const SORTS: readonly SortKey[] = ['hot', 'new', 'top', 'rising']

/** The board's filter and sort as a URL query, so a view is a link and Back
 *  steps through them. Read on load and on the browser's Back/Forward. */
interface View {
  sort: SortKey
  category: string | null
  query: string
  savedOnly: boolean
}

function readView(): View {
  const p = new URLSearchParams(window.location.search)
  const rawSort = p.get('sort')
  const rawCategory = p.get('c')
  return {
    sort: rawSort && SORTS.includes(rawSort as SortKey) ? (rawSort as SortKey) : 'hot',
    category: rawCategory && CATEGORY_IDS.includes(rawCategory) ? rawCategory : null,
    query: p.get('q') ?? '',
    savedOnly: p.get('saved') === '1',
  }
}

export default function App() {
  const { theme, toggle } = useTheme()
  const { links, votes, loading, error, vote, submit } = useLinks()

  const initial = useRef(readView())
  const [sort, setSort] = useState<SortKey>(initial.current.sort)
  const [category, setCategory] = useState<string | null>(initial.current.category)
  const [query, setQuery] = useState(initial.current.query)
  const [savedOnly, setSavedOnly] = useState(initial.current.savedOnly)
  const [saved, setSaved] = usePersistentState<string[]>('linkit:saved', [])
  const [mode, setMode] = usePersistentState<ViewMode>('linkit:view', 'card')

  // Mirror the view into the URL. A change of community, sort, or the saved
  // filter is a new place worth a Back step; a search keystroke replaces the
  // current entry so the history stays walkable. Writing only when the string
  // actually differs from the address bar is what keeps Back/Forward — which
  // set the state below — from pushing the same entry straight back on.
  const lastDiscrete = useRef(`${sort}|${category}|${savedOnly}`)
  useEffect(() => {
    const params = new URLSearchParams()
    if (sort !== 'hot') params.set('sort', sort)
    if (category) params.set('c', category)
    if (savedOnly) params.set('saved', '1')
    if (query.trim()) params.set('q', query.trim())
    const search = params.toString()

    const discrete = `${sort}|${category}|${savedOnly}`
    const pushes = discrete !== lastDiscrete.current
    lastDiscrete.current = discrete

    if (search === window.location.search.replace(/^\?/, '')) return
    const url = search ? `?${search}` : window.location.pathname
    if (pushes) window.history.pushState(null, '', url)
    else window.history.replaceState(null, '', url)
  }, [sort, category, savedOnly, query])

  useEffect(() => {
    const onPop = () => {
      const view = readView()
      setSort(view.sort)
      setCategory(view.category)
      setQuery(view.query)
      setSavedOnly(view.savedOnly)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const visible = useMemo(() => {
    const ranked = rankLinks(links, sort, votes)
    return ranked.filter(
      (link) =>
        (category === null || link.category === category) &&
        matchesQuery(link, query) &&
        (!savedOnly || saved.includes(link.id)),
    )
  }, [links, sort, votes, category, query, savedOnly, saved])

  const toggleSave = (id: string) =>
    setSaved((current) =>
      current.includes(id) ? current.filter((saved) => saved !== id) : [...current, id],
    )

  const pickCategory = (next: string | null) => {
    setCategory(next)
    setSavedOnly(false)
  }

  const goHome = () => {
    setSort('hot')
    setCategory(null)
    setQuery('')
    setSavedOnly(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <AppBar query={query} onQuery={setQuery} theme={theme} onToggleTheme={toggle} onHome={goHome} />

      <Page>
        <Feed>
          {!isConfigured && (
            <Banner>
              No database configured — copy <code>.env.example</code> to <code>.env</code> and fill
              in your Firebase keys.
            </Banner>
          )}
          {error && <Banner>{error}</Banner>}

          <SubmitCard disabled={!isConfigured} onSubmit={submit} />

          <SortBar
            sort={sort}
            onSort={(next) => {
              setSort(next)
              setSavedOnly(false)
            }}
            savedOnly={savedOnly}
            savedCount={saved.length}
            onToggleSaved={() => setSavedOnly((on) => !on)}
            viewToggle={<ViewToggle mode={mode} onMode={setMode} />}
          />

          {category !== null && (
            <CommunityHeader
              category={category}
              count={visible.length}
              onClear={() => setCategory(null)}
            />
          )}

          {loading ? (
            <FeedSkeleton />
          ) : visible.length === 0 ? (
            <EmptyFeed {...emptyCopy(links.length, query, savedOnly, sort)} />
          ) : (
            <Rows>
              {visible.map((link, index) => (
                <LinkRow
                  key={link.id}
                  link={link}
                  rank={index + 1}
                  saved={saved.includes(link.id)}
                  mode={mode}
                  onVote={vote}
                  onToggleSave={toggleSave}
                  onPickCategory={pickCategory}
                />
              ))}
            </Rows>
          )}
        </Feed>

        <Sidebar links={links} active={category} onPick={pickCategory} />
      </Page>

      <Footer>
        linkit — anonymous, community-run, and only as good as what you post.
      </Footer>
    </>
  )
}

function emptyCopy(total: number, query: string, savedOnly: boolean, sort: SortKey) {
  if (savedOnly) {
    // Reached by arriving with nothing saved, or by unsaving the last link —
    // "yet" is wrong for the second reader, so the copy suits both.
    return { message: 'Nothing saved.', hint: 'Hit Save on a link and it lands here.' }
  }
  if (query.trim()) {
    return { message: `No links match "${query.trim()}".`, hint: 'Try a shorter search.' }
  }
  if (sort === 'rising' && total > 0) {
    return { message: 'Nothing’s rising right now.', hint: 'Rising shows links from the last 12 hours.' }
  }
  if (total === 0) {
    return { message: 'The board is empty.', hint: 'Post the first cool link.' }
  }
  return { message: 'Nothing in this community yet.', hint: 'Post the first one.' }
}
