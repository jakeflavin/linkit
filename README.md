# linkit

An anonymous, community-run board of links worth keeping. Post what you find,
vote on what other people post, and let the downvotes do the pruning. No
accounts, no profiles, no comments — just links and arrows.

React 19 + Vite SPA on Firebase Firestore, styled after Reddit. See
[DESIGN.md](DESIGN.md) for every visual decision and
[FEATURES.md](FEATURES.md) for what the app does.

## Commands

```bash
npm run dev            # vite dev server (needs .env, talks to the live project)
npm run emulators      # local Firestore on :8080, emulator UI on :4000
npm run dev:emulator   # dev server pointed at that emulator
npm run seed           # fill the emulator with a believable board
npm run test           # vitest
npm run typecheck      # tsc -b --noEmit
npm run lint           # oxlint
npm run build          # typecheck + vite build
npm run icons          # regenerate public/icon-*.png from the mark
```

Local development needs no Firebase credentials at all:

```bash
npm run emulators      # leave running
npm run seed
npm run dev:emulator
```

## Configuration

Copy `.env.example` to `.env` and fill in the web config from the Firebase
console (Project settings → Your apps → Web app). Without it the app still
runs, shows an empty board, and says it is not connected.

## Structure

```
src/
  App.tsx              feed layout, filter and sort state
  firebase.ts          the only module that configures the SDK
  components/          presentation only
  hooks/               useLinks (the board), useTheme, usePersistentState
  lib/
    api.ts             every Firestore read and write
    ranking.ts         hot/new/top/rising and the removal rule — pure
    url.ts             normalizing, validating, and parsing links — pure
    time.ts            relative timestamps — pure
    identity.ts        the anonymous voter id
  data/categories.ts   the communities, as one list
firestore.rules        what an anonymous client is allowed to do
scripts/seed.mjs       emulator fixtures
```

## Data model

```
links/{linkId}                  url, title, domain, category, createdAt, ups, downs, image
links/{linkId}/votes/{voterId}  dir (1 | -1), voter, at
```

Sorting, filtering, and search all happen on the client over one live
subscription — the board is a curated list, not a firehose, so it needs no
composite indexes and re-ranks the instant a vote lands.

## Preview images

A browser cannot read another origin's `og:` tags and linkit has no server, so
`lib/preview.ts` unfurls a link through Microlink when it is posted and stores
the result on the document. That is a third-party dependency with a per-IP
daily quota, which is why it runs once per post and never on read — the quota
lands on each submitter's own IP rather than on whoever opens the feed. A
failed lookup is silent: the link posts without a preview.

Links with no image fall back to a favicon tile, and card view quietly becomes
compact view for them, so a missing image is never an empty box.

## How moderation works

There is no moderator. A link is deleted for good once its score reaches
**-5**: any client that sees one at or below the threshold deletes it, and
`firestore.rules` permits the delete only at that score. So the sweeping is
done by whoever happens to be looking, and no server is involved.

## Anonymity, honestly

A voter is a random id in `localStorage`. That stops the same browser voting
twice and nothing more — clearing storage buys another vote. That is the
deliberate trade for having no sign-up, and the rules are written to keep the
data well-formed rather than to identify anyone.

## Deploying

Pushes to `main` run lint, typecheck, tests, and a build, then deploy to
Firebase Hosting. The workflow needs `FIREBASE_SERVICE_ACCOUNT` as a secret
and the `VITE_FIREBASE_*` values as repository variables.

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Standards

Code in this repo follows the [shared standards](https://github.com/jakeflavin/portfolio/blob/main/docs/STANDARDS.md) and [layout](https://github.com/jakeflavin/portfolio/blob/main/docs/LAYOUT.md) used across the directory.
