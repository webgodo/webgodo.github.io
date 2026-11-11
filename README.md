# mohsengh.com

A résumé you can play. The homepage is **Career Breaker**, an Arkanoid-style game where every row of bricks is a job; clear a row to reveal it. The rest of the site (timeline, skills, projects, articles, CV) is plain content in the same arcade skin.

Live: https://mohsengh.com

## Stack

- Vite + React 19 + TypeScript, deployed to GitHub Pages by GitHub Actions on every push to `main`.
- The game is plain Canvas 2D, no engine: `src/game/breaker.ts`. Sound is a Web Audio chiptune synth, `src/game/sound.ts`, muted until you opt in.
- Content lives in the repo: `content/profile.json` (timeline, skills, projects) and `content/articles/*.md`. `scripts/build-content.mjs` turns them into JSON before every dev/build.
- Articles are edited at `/admin` with [Sveltia CMS](https://sveltiacms.app). Every save is a commit. GitHub login goes through a free Cloudflare Worker ([sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)); set its URL as `base_url` in `public/admin/config.yml`.
- Hosting cost: $0.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test
pnpm build      # dist/ (+ rss.xml, sitemap.xml)
```

## Assets

- `pnpm vite preview --port 4173`, then `node scripts/export-cv.mjs` regenerates `public/mohsen_ghaemmaghami-cv.pdf` from the `/cv` page.
- With the same preview running, `node scripts/record-launch.mjs <frames-dir>` records the homepage; `design/launch/` holds the resulting GIF and MP4 for launch posts.

## Make it yours

Fork it, replace `content/profile.json` and the favicons in `public/`, update `CNAME` (or delete it), and push. The bricks, the timeline, the skills sheet and the CV page all read from that one JSON file.

Easter egg: ↑ ↑ ↓ ↓ ← → ← → B A opens **Scope Creep**, a Pac-Man mini-game where the ghosts are BUG, DEADLINE, SCOPE CREEP and LEGACY and the power pellet is a ☕. On a touch screen, tap the marquee logo 10 times quickly instead.

## Licence

Code: MIT. Content (text, CV, images): © Mohsen Ghaemmaghami.
