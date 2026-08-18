# linkit — design spec

linkit's UI follows **Reddit**, because Reddit already solved the problem this
app has: a long list of links, each owned by nobody, ranked by arrows. This
file is the source of truth for every visual decision. Nothing here is shared
with the other apps in the workspace — linkit deliberately looks like itself.

What this spec covers: colour, typography, shape, layout, component recipes,
and voice.

---

## 1. Colour

Three colours carry meaning and never move between themes, because they *are*
the brand:

| Token      | Value     | Meaning                                            |
| ---------- | --------- | -------------------------------------------------- |
| `--up`     | `#FF4500` | Upvote, the logo, and any "about to be removed" warning |
| `--down`   | `#7193FF` | Downvote, and only downvote                        |
| `--accent` | `#0079D3` | Every other interactive thing: links, buttons, tabs, focus |

Everything else is greyscale, and flips with the theme:

| Token         | Light     | Dark      | Use                                  |
| ------------- | --------- | --------- | ------------------------------------ |
| `--bg`        | `#DAE0E6` | `#030303` | The sunken page behind the cards      |
| `--surface`   | `#FFFFFF` | `#1A1A1B` | Every card, and the app bar           |
| `--surface-2` | `#F6F7F8` | `#272729` | Inputs and the search field           |
| `--rail`      | `#F8F9FA` | `#161617` | The vote column and the rank column   |
| `--line`      | `#CCCCCE` | `#343536` | Card borders                          |
| `--text`      | `#1C1C1C` | `#D7DADC` | Body copy and titles                  |
| `--dim`       | `#7C7C7C` | `#818384` | Meta lines, counts, action labels     |

Rules:

- **Community colours are data, not chrome.** The ten hues in
  `data/categories.ts` appear only as the dot on a pill, the dot in the
  sidebar, and the top rule of the community header. They never colour text
  or a background fill at full strength.
- A hex literal outside the two `:root` blocks is a defect. Everything else
  reads a token.
- The at-risk warning borrows `--up` rather than introducing a red. Orange is
  already the app's "attention" colour.

## 2. Typography

- **Headings and the wordmark**: IBM Plex Sans, 600–700. This is Reddit's
  display face and it is what makes the wordmark read correctly.
- **Body**: Noto Sans, 400/600/700, with the system stack behind it.
- Exactly three sizes exist outside of headings, declared as tokens:

| Token          | Size | Use                                                     |
| -------------- | ---- | ------------------------------------------------------- |
| `--font-title` | 18px | A link's title — the one thing a reader is scanning for |
| `--font-body`  | 14px | Buttons, tabs, sidebar rows, inputs                     |
| `--font-meta`  | 12px | The meta line, domains, counts, action labels, errors   |

- Titles are **weight 500**, not bold. On Reddit the title is long and the
  weight is light; bolding it turns the feed into noise.
- Scores and counts are `tabular-nums` so a column of them does not jitter as
  votes land.
- Card headings (`ABOUT LINKIT`, `COMMUNITIES`) are the one place uppercase
  and letter-spacing appear — that is Reddit's sidebar eyebrow.

## 3. Shape & space

- **Radius**: 4px on everything — cards, inputs, buttons-that-are-not-pills.
  Pills (chips, sort tabs, the primary button, the search field) are fully
  round. 2px on the vote arrows and the row action buttons.
- **Borders, not shadows.** There is no shadow anywhere in the app. Depth
  comes from a 1px `--line` border and the card sitting on the sunken `--bg`.
- **Spacing**: 4 / 8 / 12 / 16 / 24. Card padding is 12–16px; the gap between
  rows is 8px; between the feed's sections, 12px.

## 4. Layout

The page is Reddit's two-column feed, centred:

- **App bar**: 48px, sticky, `--surface` with a bottom border. Wordmark left,
  a pill search field taking the middle, theme toggle right.
- **Feed**: 640px, holding the compose box, the sort bar, an optional
  community header, and the rows.
- **Rail**: 312px, sticky under the app bar, holding About / Communities /
  How it works.
- Below **1000px** the rail stops being sticky and stacks under the feed.
- Below **640px** the wordmark and the rank column both go — the arrows are
  worth more than either — the sort bar scrolls horizontally, and inputs hold
  16px so iOS does not zoom on focus.

### The row

```
┌──────┬────────┬──────────────────────────────────────┐
│ rank │  ▲     │  l/design • 3h ago                   │
│  1   │  309   │  Excalidraw — hand-drawn diagrams…   │
│      │  ▼     │  ⬦ excalidraw.com ↗                  │
│      │        │  ⧉ Copy link    ⚑ Save               │
└──────┴────────┴──────────────────────────────────────┘
   28px    40px                  fills
```

The rank and vote columns share the `--rail` background so they read as one
gutter; a hairline separates the gutter from the body.

## 5. Preview images

Two densities, chosen by the reader and remembered:

- **Compact** (default): a 76px square left of the title, 56px on a phone.
  Roughly 18 links stay on screen.
- **Card**: a full-width 16:9 hero under the domain line, capped at 320px
  tall.

Rules:

- **A card row without a usable image falls back to a compact row.** Most
  links have no `og:image`, and plenty of the ones that do serve an image that
  404s or blocks hotlinking. An empty 16:9 box is worse than no box, so card
  view is a mix: heroes where there is something to show, compact rows where
  there is not.
- **The fallback tile is part of the design, not an error state.** It is the
  site's favicon centred on a `--surface-2` tile with the same border and
  radius as a real image. It should read as deliberate.
- Images are cropped with `object-fit: cover` into a fixed box, so a row's
  height never depends on what a site happens to serve.
- Previews are `loading="lazy"` and `referrer-policy: no-referrer` — the
  latter because some hosts serve a placeholder or a 403 to foreign referrers.
- Only https images are stored. An http one would make the whole page mixed
  content.

## 6. Component recipes

- **Vote arrows** are `lucide-react`'s `ArrowBigUp` / `ArrowBigDown`, 22px,
  stroke 1.75. A cast vote fills the glyph with `currentColor` and tints the
  score to match. Hover previews the colour.
- **Pills and chips** carry their community colour as a 7px dot before the
  label, set through a `--pill` custom property. A selected chip mixes 14% of
  that colour into the surface.
- **The compose box** is a one-line stub until clicked, then a three-field
  form. It never becomes a modal — Reddit's does not, and the feed staying
  visible is the point.
- **Buttons**: `.btn.primary` is a filled `--accent` pill; `.btn.ghost` is the
  same pill outlined. Row actions are borderless and grey until hovered.

## 7. Voice

Sentence case everywhere. Labels say what the control does. The copy is
plain and slightly dry — "Post a cool link", "on thin ice", "The board is
empty", "only as good as what you post". No exclamation marks, no
encouragement, no product-speak.

## 8. Accessibility

- Every icon-only button carries an `aria-label`; every toggle carries
  `aria-pressed`.
- The sidebar rows and pill buttons label themselves with their visible text,
  so a screen reader and a sighted reader hear the same thing.
- Focus is a 2px `--accent` ring at 2px offset, never removed.
- The score is `aria-live="polite"` so a vote is announced.
- Preview images are decorative: they are `aria-hidden`, carry an empty alt,
  and their link is removed from the tab order, because the title right beside
  them already goes to the same place.
- Both themes are verified on every UI change. So are 375px, 1000px, and
  1400px.
