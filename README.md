# bookmark-demos

Evergreen home for daily X-bookmark prototypes.

`main` ships a working Vite + vanilla starter: an interactive WebGL globe (`cobe`) on a dark page. That is the first daily-bookmark prototype pattern — spinning earth, drag to look around, no APIs or secrets. Mike’s first **Import Project** on Vercel should build this and serve a real preview.

## Model

- **One** GitHub repo ↔ **one** Vercel project on team `themikefactorymustgrows`
- GitHub is the source of truth (not an Origin mirror)
- **Daily = a branch preview.** Each day gets a branch (or dated folder on that branch). Vercel deploys a unique preview URL. Do **not** create a second Vercel project.
- Optional: promote “today” to production or a fixed alias from that same project

## Local

```bash
npm install
npm run dev
```

Vite prints a localhost URL. The globe needs WebGL (hardware acceleration on).

```bash
npm run build    # writes static files to dist/
npm run preview  # serve dist/ locally
```

No `.env` files. No API keys.

## First Vercel link (one-time, Mike)

Do this once so Git deploys start flowing. Do not invent extra team OAuth workarounds — use the normal Import Project flow.

1. Open [https://vercel.com/new](https://vercel.com/new)
2. Team: **themikefactorymustgrows**
3. Import **TheMikeFactoryMustGrow/bookmark-demos** from GitHub
4. Framework: **Vite** (this repo sets `"framework": "vite"` in `vercel.json` so Vercel should auto-detect; if the import UI asks, pick **Vite**)
5. Root directory: repo root
6. Build command: `npm run build` · Output: `dist/` (Vite preset defaults; leave them unless the UI is blank)
7. Environment variables: none
8. Deploy

After this, every push to a branch and every PR gets a preview. Merges to `main` update production.

If auto-detect ever misses Vite, set the project Framework Preset to **Vite** in Project Settings. Still one project.

## Daily loop (Daedalus)

1. Pick a buildable X bookmark
2. Branch from `main` as `day-YYYY-MM-DD` (or a short feature name)
3. Build the prototype in this repo — replace or extend the globe page, keep `npm run build` → `dist/`
4. Push the branch. Vercel posts a **preview URL**. Send that to Mike
5. Archive by leaving the branch. Do not open a new Vercel project
6. Optional: PR into `main` only if this day should become the new evergreen landing

## Stack

| Piece | Why |
| --- | --- |
| Vite + vanilla JS | Fast local loop; Vercel detects Vite and publishes `dist/` |
| `cobe` | ~5KB WebGL globe — the day-0 prototype pattern |
| `vercel.json` | Pins the Vite framework slug for Git deploys |

## Layout

```
index.html
src/main.js          # globe + copy
src/style.css
public/favicon.svg
vite.config.js       # outDir: dist
vercel.json          # framework: vite
```
