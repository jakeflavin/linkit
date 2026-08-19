import { useMemo, useState } from 'react'
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
import type { SortKey, ViewMode } from './lib/types.ts'

export default function App() {
  const { theme, toggle } = useTheme()
  const { links, votes, loading, error, vote, submit } = useLinks()

  const [sort, setSort] = useState<SortKey>('hot')
  const [category, setCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [saved, setSaved] = usePersistentState<string[]>('linkit:saved', [])
  const [mode, setMode] = usePersistentState<ViewMode>('linkit:view', 'card')

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

  return (
    <>
      <AppBar query={query} onQuery={setQuery} theme={theme} onToggleTheme={toggle} />

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
            <EmptyFeed {...emptyCopy(links.length, query, savedOnly)} />
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

function emptyCopy(total: number, query: string, savedOnly: boolean) {
  if (savedOnly) {
    return { message: 'Nothing saved yet.', hint: 'Hit Save on a link and it lands here.' }
  }
  if (query.trim()) {
    return { message: `No links match "${query.trim()}".`, hint: 'Try a shorter search.' }
  }
  if (total === 0) {
    return { message: 'The board is empty.', hint: 'Post the first cool link.' }
  }
  return { message: 'Nothing in this community yet.', hint: 'Post the first one.' }
}
