# linkit

An anonymous community link board: no accounts, links ranked by arrows, and
downvotes delete. React 19 + Vite SPA on Firebase Firestore, styled after
Reddit. Overview, commands, and structure: [README.md](README.md).

## Rules (must follow)

- Never assume anything — your knowledge may be out of date. Use the context7
  MCP for current docs whenever a question involves a library, framework, or
  CLI (React, Vite, Firebase, firebase-tools, lucide-react, …).
- Read [DESIGN.md](DESIGN.md) before making any UI change. Verify both themes.
- Read [FEATURES.md](FEATURES.md) when planning or touching an existing
  feature. Update it when behavior changes.
- All Firestore I/O goes through `src/lib/api.ts`. No `firebase/*` imports
  outside `api.ts` and `firebase.ts`.
- Ranking, URL handling, and time formatting stay pure and tested in
  `src/lib/`. Components render; hooks hold state.
- Tokens only in CSS: a hex literal outside the two `:root` blocks is a
  defect.
- `REMOVAL_SCORE` in `src/lib/ranking.ts` and `removalScore()` in
  `firestore.rules` are the same number. Changing either changes both.
- Never remove functionality.

## Workflow

1. Follow all rules and pull in context before writing anything.
2. Ask follow-up questions; never assume you understand what is being asked.
3. Write tests alongside the change.
4. Always visually verify your changes as if you were a real user — both
   themes, and 375/1000/1400px when layout is touched. Run the emulator and
   seed it rather than testing against the live board.
5. Run lint, typecheck, and tests before pushing.
6. Make small commits with detailed messages.
7. Unless specified otherwise, work in and push directly to `main`.
