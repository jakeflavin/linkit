# linkit — features

What the app does today. Behaviour changes update this file in the same
commit.

## The board

- One live subscription streams every link (capped at 500). Sorting,
  filtering, and search all run on the client, so the feed re-ranks the
  instant a vote lands anywhere.
- **Sorts**: Hot (Reddit's log-score-plus-age formula), New (recency), Top
  (raw score), Rising (score per hour, and only for links under 12h old).
  Ties always break by recency.
- **Search** matches title, domain, and community, case-insensitively.
- **Communities** filter the feed from the sidebar or by clicking a pill on
  any row. A selected community gets a header with its blurb and count.
- **Saved** is a local bookmark list in `localStorage`; it is a filter, not a
  sort, and it never leaves the browser.

## Preview images

- Each link stores the featured image (`og:image`) found when it was posted.
- The feed has two densities, remembered per browser: **compact**, a 76px
  thumbnail beside the title, and **card**, a full-width 16:9 hero.
- A card row whose image is missing or fails to load renders as a compact row
  instead, so the feed never grows empty boxes.
- Links with no image — the common case — show a tile with the site's favicon.

## Posting

- The compose box takes a URL, a title, and a community.
- Shortly after a valid URL is typed, the page is looked up: the featured
  image is fetched and kept, and the real page title is filled in for you.
  Anything you have already typed is never overwritten, and the filled title
  stays editable.
- The lookup goes through Microlink, which has a modest per-IP daily quota. It
  runs once per post rather than once per render, so the quota falls on each
  submitter rather than on readers, and a failed lookup never blocks a post —
  it just means no preview image.
- A bare host (`example.com`) is accepted and normalized to `https://`;
  `http://` is upgraded rather than rejected; fragments are stripped so the
  same page cannot be posted twice under two URLs.
- Duplicates are rejected against the existing board.
- A new link starts with the submitter's upvote already cast — you vouch for
  what you post, and it keeps a fresh link clear of the removal threshold.

## Voting

- One vote per link per browser. Clicking the same arrow again clears the
  vote.
- A vote moves the tally and writes the vote document in a single Firestore
  transaction, so a link's score can never drift from its votes.
- The UI applies the vote optimistically and rolls back if the write fails.
- Votes are restored on load with one collection-group query, so the arrows
  survive a reload.

## Removal

- A link at or below a score of **-5** is deleted permanently.
- Any client that sees one sweeps it; `firestore.rules` permits the delete
  only at that score, so there is nothing to trust and no server to run.
- A link within 2 points of the threshold is marked **on thin ice** in the
  meta line.
- A sweeper also deletes its own vote document, which a document delete would
  otherwise orphan.

## Chrome

- Light and dark themes, defaulting to the OS preference and persisted after
  that.
- Installable: manifest, maskable icons, iOS meta tags.
- Empty, loading, and error states for the feed, plus a banner when no
  database is configured.
