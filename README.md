# bookmark-demos

Evergreen home for daily X-bookmark prototypes.

## Model

- **One** GitHub repo ↔ **one** Vercel project on `themikefactorymustgrows`
- Each day: a branch (or dated folder) → Vercel **preview** URL
- Optional: promote “today” to production / a fixed alias

## First Vercel link (one-time, Mike)

1. Open https://vercel.com/new
2. Team: **themikefactorymustgrows**
3. Import **TheMikeFactoryMustGrow/bookmark-demos**
4. Framework: Vite (or auto-detect). Root: repo root.
5. Deploy. After this, every push auto-deploys.

## Daily loop (Daedalus)

1. Pick a buildable X bookmark
2. Cloud agent builds on branch `day-YYYY-MM-DD` (or feature name)
3. Push → preview URL to Mike
4. Archive by leaving the branch; no new Vercel project

Scaffolding lands on `main` next.
