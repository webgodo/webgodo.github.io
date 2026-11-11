# mohsengh.com redesign — proposal

Goal in one line: a homepage that a recruiter remembers, a developer shares, and that costs $0 to run on GitHub Pages.

Two hard requirements drive every decision below:

1. **Hireable in 6 seconds.** A recruiter must see name, title, "12+ years, React/TS/Node", and a "Download CV" within the first screen, even if they never touch the game. The game is the hook, not a gate.
2. **Shareable.** Every play ends in something people want to post: a score card, a GIF-able moment, an easter egg. Precedents that went viral with this exact formula: Robby Leonardi's Mario-style interactive resume (rleonardi.com) and Bruno Simon's drive-a-car portfolio (bruno-simon.com). Both are "a game that happens to be a resume", both are 10+ years old and still get shared.

---

## 1. Your data (pulled from LinkedIn + the CV PDF in this repo)

LinkedIn is newer than the PDF. The PDF stops at Oxolo and omits everything before 2018. Use LinkedIn as the source of truth and regenerate the PDF from the site later.

**Headline:** Senior Software Engineer | NodeJS, ReactJS, NextJS, JavaScript, TypeScript. Based in Australia, remote.

### Career timeline (the "levels")

| # | Years | Role | Company | Tech / highlights |
|---|-------|------|---------|-------------------|
| 1 | May 2012 – Mar 2013 | Web Developer | Jamdigital | PHP. First job. |
| 2 | Mar 2013 – Apr 2014 | Website Manager & Admin | Jamdigital | Game-player ranking platform, PHP + jQuery, 1M+ users, 98% uptime, BMI.ir integration |
| 3 | Nov 2013 – Jul 2018 | Software Engineer | Farakav | Varzesh3.com frontend (VanillaJS, Grunt, Bootstrap), live scores via WebSocket <1s latency, Anten.ir streaming (Vue, HLS.js), AngularJS admin, ASP.NET MVC services |
| 4 | May 2015 – Jul 2016 | Co-Founder | Amoozesh.it | Web dev course sold on DVDs (yes, DVDs), marketing, +20% conversion |
| 5 | Sep 2016 – Dec 2017 | Software Developer | Magic Mirror Institute | WordPress + PHP, nginx, ~0 downtime |
| 6 | Jul 2018 – Sep 2022 | Software Development Team Lead | Mootanroo | Led 20 engineers, 2x sales, React + Redux + SSR, TTFB ~130ms, React Native iOS/Android |
| 7 | Oct 2022 – Jun 2023 | Senior Frontend (Web3) | Web3 Bridge / Rango | ether.js, Compound SDK, TDD with Jest/RTL/Storybook, Next.js + Tailwind rewrite, +25% load time |
| 8 | Jul 2023 – Sep 2024 | Senior Frontend Developer | Oxolo (Germany) | Module federation, pnpm+nx, React Query, Tailwind, Storybook design system, −40% bundle, Playwright, gRPC/ConnectRPC prototype, mentored 2 future tech leads |
| 9 | Nov 2024 – Apr 2025 | Senior Software Engineer | Bettermode | Node.js, TypeScript, WebSocket, software design |
| 10 | May 2025 – present | Senior Software Engineer | Lambda Curry | Medusa, Node.js, Redis |

### Education
- MEng Artificial Intelligence, Payame Noor University, 2016 – present
- BSc Computer Software Engineering, Shamsipour Technical College, 2013 – 2015
- BS Computer Engineering, Esfahan Technical College (Mohajer), 2010 – 2012

### Projects (the "bonus stages")
Anten.ir (live sports streaming, Vue), EtemadOnline.com (news, Vue, SEO +30%), TV3.ir (national TV channel site), Football Fantasy (first fantasy soccer game in Iran, Vue 2), Varzesh3 Lenz (Instagram crawler), Palladium Mall (largest mall in Iran, site + admin), Peekage MVP (startup that raised CAD 2M), Sejam.ir (consultant), Online Strategy Game (head master), Amoozesh.it course.

### Skills (from CV + LinkedIn)
JavaScript, TypeScript, React, Next.js, Node.js, Vue, Redux, React Query, Tailwind, SASS, HTML/CSS, GraphQL, REST, gRPC, WebSocket, Redis, Medusa, Webpack, Vite, pnpm/nx monorepo, micro-frontends/module federation, Storybook, Jest, React Testing Library, Cypress, Playwright, TDD/BDD, Sentry, Git, React Native, ether.js/Web3, PHP (past), jQuery (past), AngularJS (past), nginx, WordPress. Languages: Persian (native), English (fluent), German (basic).

---

## 2. Game concepts — 15 ideas, ranked

Each idea says how it *reveals* Timeline / Skills / Projects / Articles, what the shareable moment is, and rough effort (S/M/L). Mobile matters: most viral traffic comes from phones, so touch controls are a must for whichever one wins.

| # | Concept | How it reveals your content | Viral hook | Effort |
|---|---------|-----------------------------|------------|--------|
| 1 | **Career Breaker (Arkanoid / Brick Breaker)** — your pick | The brick wall is a grid; each row is a job (2012 at the bottom, 2025 at the top). Breaking a row's bricks flips them to reveal the role card. Special bricks: "?" = skill, gold = project, paper = article. Power-ups named after tech: "React" splits the ball into 3, "TypeScript" widens the paddle, "Legacy jQuery" shrinks it. | Finish time + bricks broken → "I broke Mohsen's career in 00:47" share card. Boss brick at top: "Hire me". | M |
| 2 | **Side-scrolling platformer timeline (Mario-style)** | Walk left→right through the years. Each world = one company with its own tileset (Farakav = football stadium, Mootanroo = marketplace, Oxolo = German office). Hit "?" blocks for skills, pipes drop into project pages, flagpole = "Download CV". | The format that made rleonardi.com famous. GIF-friendly. | L |
| 3 | **Space Invaders: Bug Invaders** | Each wave is a company. Enemies are bugs/tickets; the boss at the end is "Legacy Codebase". Clearing a wave unlocks that job's card. | Score, "waves survived". | M |
| 4 | **Pac-Man: Scope Creep** | Maze of your career; pellets = skills; power pellet = ☕; ghosts named Bug, Deadline, Scope Creep, Legacy. Fruit = projects. | Ghost names alone will get screenshotted. | M |
| 5 | **Snake (Nokia 3310 frame)** | Eat tech logos; the snake grows into your skill list in the order you learned them. Crash into "jQuery" and it's game over. | Phone-shaped frame on a phone screen is delightful. Very mobile-native. | S |
| 6 | **Tetris: Stack Overflow** | Falling tetrominoes carry tech names; each cleared line reveals one timeline entry. Game over screen says "Stack Overflow" (literally). | The pun. | M |
| 7 | **Pokémon-style RPG overworld** | Pixel town; buildings are companies, NPCs are articles, a lab is "Skills". Battle screen: "MOHSEN used useMemo! It's super effective!" vs "Wild RE-RENDER appeared!" | Battle text is extremely screenshot-able. | L |
| 8 | **Street Fighter character select** | Choose a fighter = a skill area (React, Node, Web3, Leadership). VS screen: "MOHSEN vs LEGACY CODE — ROUND 1 — FIGHT!" Winning reveals that area's details. | VS screen is a natural OG image. | M |
| 9 | **Chrome Dino runner** | The offline dino, but the cacti are "production incidents" labelled by year; distance = years of experience; each 1,000 m milestone pops a job card. | Everyone knows the dino; instant recognition. | S |
| 10 | **Minesweeper** | Grid of hidden tiles; numbers hint at where skills are; mines = "production outage". Reveal all to unlock the full resume. | "I cleared Mohsen's resume without hitting a prod incident". | S |
| 11 | **Game Boy cartridge shell (non-game nav)** | The homepage *is* a Game Boy. Sections are cartridges (TIMELINE.gb, SKILLS.gb, ARTICLES.gb). "Inserting" one plays a boot jingle and loads that page. Any game above can be one cartridge. | Pure nostalgia, works as the wrapper for everything else. | S |
| 12 | **Windows 95 / MS-DOS desktop** | Boot screen → desktop; "My Résumé.doc", "Projects" folder, Minesweeper/Solitaire are the games, Notepad opens articles. | Huge retro-web trend; low effort for high "wow". | M |
| 13 | **Oregon Trail / text adventure** | "You have 12 years of experience. You have died of dysentery" → "Your PR was rejected". Choose-your-own career path in a green phosphor terminal. | Text is cheap to make and very quotable. | S |
| 14 | **Arcade cabinet attract mode** | Idle homepage runs a self-playing demo of the game with "INSERT COIN / PRESS START" blinking, high-score table seeded with your companies. Press any key to take control. | Autoplay demo loops are perfect for the LinkedIn video post. | S (on top of #1) |
| 15 | **Flappy Bird through the years** | Pipes are labelled with years; passing 2018 unlocks Mootanroo, etc. | Rage-quit factor = shares. | S |

### Recommendation: ship #1 wrapped in #11 + #14, hide #4 as an easter egg

- **Hero:** Career Breaker (your Brick Breaker instinct is right: a brick grid maps 1:1 onto a timeline grid, it finishes in under a minute, and touch control is just "drag the paddle").
- **Shell:** the whole site is skinned as a handheld/arcade (#11): pixel font, CRT scanlines, boot jingle, cartridge menu. Articles and Skills pages are plain content inside that skin, no game, as you asked.
- **Attract mode (#14):** when idle, the game plays itself on the homepage so the first screen is already moving. This is also what you record for the LinkedIn/Twitter launch post.
- **Easter egg:** Konami code (↑↑↓↓←→←→BA) launches Pac-Man "Scope Creep" (#4) with the named ghosts. Easter eggs are what Hacker News comments are made of.
- **Recruiter escape hatch:** a visible "Skip the game → résumé" button and a print-friendly `/cv` page. Never make a hiring manager play to see your title.

Second-best option if you want maximum virality and can spend 2–3× the effort: #2, the platformer timeline. It is the most proven format but needs level design per company.

---

## 3. Site map

```
/            Game Boy / arcade shell → Career Breaker (attract mode when idle)
             Above the fold, always visible even without playing:
             name, title, "12+ yrs • React • TypeScript • Node", [Download CV] [Skip game]
/timeline    The levels as a vertical pixel timeline (same data as the bricks)
/skills      The fun page (section 4), RPG stat-sheet style
/projects    Bonus stages: cards with pixel-art thumbnails
/articles    List, plain reading view in the retro skin, no game
/articles/:slug
/cv          Print-friendly plain HTML resume (also the source for the PDF)
/admin       Article editor (section 6) — not linked from nav
```

Everything is driven by one `content/profile.json` (timeline, skills, projects) so the bricks, the timeline page, the skills page and the CV page never drift apart.

---

## 4. Skills page: the fun one

Tone bar: **funny, not silly.** Every line is something a senior engineer could say out loud in a good interview and get a smile, not a wince. The joke is always about the technology's quirks or the job's reality, never about being bad at it. No memes, no profanity, no "I'm sorry". Hover/tap flips each card to the serious CV one-liner and the years used.

Format: an RPG character sheet. Each skill has a level (Lv. 1–99 mapped from years and depth), a pixel stat bar, and one line.

**HTML / CSS / Tailwind** · Lv. 92
- I can center a div. Vertically. On the first try. With Tailwind, in one class.
- I know the difference between `margin` and `padding`, and more importantly, when the answer is `gap`.
- I use `<button>` for buttons and `<a>` for links. It is remarkable how much accessibility that buys.
- My Tailwind class strings are longer than some commit messages, and far more honest.

**JavaScript** · Lv. 95
- I know why 0.1 + 0.2 isn't 0.3, and I know when it's fine to not care.
- I know what `this` refers to. The answer is "it depends who called", which is the whole lesson.
- `typeof null === "object"` has been a bug since 1995. I've learned to work around older things than that.
- I can explain the event loop with a whiteboard, and debug it with a flame chart.
- I can write a regex. I also write a comment above it, for the person I'll be in six months.

**TypeScript** · Lv. 93
- `any` is a loan with interest. I take it out rarely and pay it back fast.
- I know the difference between `type` and `interface`. I also follow whatever the codebase already does.
- I've written types strict enough that the compiler caught a bug the tests missed. That's the point of them.
- I can read a four-parameter generic without lying down afterwards.

**React** · Lv. 94
- I know the difference between `useCallback` and `useMemo`, and I know the best optimisation is usually neither.
- I know why your list needs a `key`, and why the array index is not it.
- I've never called a hook conditionally. The Rules of Hooks are the only rules I've never wanted to break.
- Wild RE-RENDER appeared! MOHSEN used `React.memo`. It's super effective.
- I've built a design system in Storybook that cut a bundle by 40%. Components with a story ship with fewer surprises.

**Next.js** · Lv. 88
- I know where `'use client'` goes, and more importantly, where it shouldn't.
- Hydration mismatches don't scare me. They're just the server and the client disagreeing about the time.

**State & data** (React Query, Redux, GraphQL, gRPC) · Lv. 90
- I moved server state out of Redux and into React Query, and half the reducers simply disappeared.
- I've written enough Redux boilerplate to know exactly which parts were worth it.
- GraphQL taught me to ask for exactly what I need. Still working on applying that elsewhere.
- I got a frontend and a backend to agree on a gRPC contract. The type checker now attends every meeting.

**Node.js & backend** (Node, Redis, WebSocket, Medusa, nginx) · Lv. 85
- I shipped live football scores to millions in under a second. The fans still blamed me for the goals.
- I know the two hard problems in computer science, and I run Redis for one of them.
- I kept a site at ~0% downtime with nginx and a small number of well-chosen defaults.

**Testing** (Jest, RTL, Playwright, Cypress, TDD) · Lv. 90
- I write the test first. Then the code. Then I read the test again, because it's now documentation.
- TDD cut bugs by 90% on one project. The remaining 10% taught me the most.
- My Playwright tests aren't flaky. My network, occasionally, is.

**Tooling** (Vite, Webpack, pnpm, nx, module federation) · Lv. 91
- I migrated Webpack to Vite and got the team's coffee breaks back.
- I've run a pnpm + nx monorepo for a team. `node_modules` is now a solved problem, not a landmark.
- I split one app into five micro-frontends with module federation. They still deploy independently and still talk to each other.

**Git & process** · Lv. 93
- I can leave a detached HEAD without searching for it. Finding my way in was the accident.
- I rebase interactively, and my history reads like a changelog instead of a diary.
- My code review comments are prefixed `nit:` more often than `blocker:`. That ratio is deliberate.
- Sentry knows about my mistakes before my users do. That is exactly the arrangement I want.

**Mobile & Web3** · Lv. 78
- Shipped iOS and Android from one React Native codebase, on the same release day.
- I've built DeFi frontends on ether.js. I treat every transaction like it's irreversible, because it is.

**Past lives** (PHP, jQuery, AngularJS, WordPress) · Lv. 70, retired with honours
- I started with PHP and jQuery in 2012. Everything I know about performance started with a 1-million-user ranking page on them.
- I sold a web-development course on DVD in 2015. Distribution has changed; teaching hasn't.

**Leadership** · Lv. 89
- Led a team of 20 and doubled sales. The hard part wasn't the code.
- Two of my mentees became tech leads. I take 30% of the credit and 100% of the pride.
- I know a "quick sync" is 25 minutes. I schedule it as 30.

**Languages**
- Persian: native. RTL support comes built in.
- English: fluent enough to argue about tabs versus spaces, and to know it doesn't matter.
- German: basic. "Ich bin Frontend-Entwickler." Enough for the office, not yet for the Finanzamt.

---

## 5. Visual & audio design: "like those games"

- **Palette:** pick one console and stick to it. Recommended: NES 54-colour palette for the game, with a 4-shade Game Boy green option as a theme toggle (dark mode = Game Boy Pocket grey). Restricting the palette is what makes it look authentic, not the pixel font alone.
- **Type:** "Press Start 2P" (headlines, HUD), "VT323" or "Silkscreen" (body; Press Start 2P is unreadable for paragraphs). Articles get a readable monospace at 18px.
- **Pixels:** `image-rendering: pixelated`, everything on a 4px grid, 1px-stepped borders (the classic RPG dialog box with corner notches), no anti-aliased curves, no drop shadows (use hard 4px offset shadows).
- **CRT layer:** scanlines + slight vignette + a subtle RGB-split on hover, all CSS, all togglable, all disabled under `prefers-reduced-motion`.
- **Sprites:** a 16×16 pixel-art avatar of you (one afternoon in Aseprite or Piskel, both free). Company "tilesets" per level. Tech logos redrawn as 8-bit icons.
- **Sound:** Web Audio chiptune synth (no audio files): boot jingle, brick hit, power-up, game over. Muted by default, one-tap unmute, remembered in localStorage. Browsers block autoplay anyway.
- **UI conventions:** "PRESS START" blink, "INSERT COIN" on CTA buttons, high-score table, "LEVEL 8: OXOLO", lives shown as ☕. Loading states are a dither-fade. Page transitions are a 4-frame wipe.
- **Accessibility:** the game is `aria-hidden`; the same content exists as real HTML underneath. Keyboard playable. Honour reduced motion by jumping straight to the revealed state.

### Mobile strategy (must work, not just "fit")
Most shares are opened on a phone, so the phone experience is the first impression for most people.

- **Career Breaker is fully playable on touch.** The canvas scales to the viewport (portrait brick grid of 6 columns instead of 10), the paddle follows a horizontal drag anywhere on the screen, and the ball speed is tuned per screen size. Brick Breaker is one of the few arcade games that is genuinely better on touch than on keyboard.
- **Game Boy shell on phones.** In portrait, the shell becomes a Game Boy held upright: screen on top, D-pad/A/B as real on-screen buttons below. In landscape or on desktop it becomes an arcade cabinet or a Game Boy Advance held sideways. Same game, two bezels.
- **Content pages** (timeline, skills, projects, articles) are plain responsive HTML and need no fallback.
- **What stays desktop-only:** the CRT curvature/RGB-split shader (GPU cost on low-end phones), the attract-mode demo while idle (battery), and the Pac-Man easter egg (needs a keyboard for the Konami code; on mobile it's unlocked by a 10-tap on the logo instead). When one of these is skipped, a small in-game "toast" in pixel font says: `★ BIGGER SCREEN = BONUS LEVEL ★ Play on desktop for the full arcade` with a "Email me the link" button that uses `mailto:` with the URL prefilled. No modal, no nag, shown once per session.
- **Performance budget on mobile:** under 150 KB JS on the homepage, 60 fps on a 2019 mid-range Android, no layout shift. Tested with Playwright's mobile emulation in CI.

---

## 6. Articles + admin dashboard

### Constraint
GitHub Pages has no built-in CMS, and GitHub's OAuth token endpoint has no CORS/PKCE, so a pure browser page cannot complete OAuth on its own. The two honest zero-cost paths are: (a) a **fine-grained Personal Access Token** (PAT) typed into the admin once and kept in localStorage, or (b) a tiny free Cloudflare Worker as an OAuth relay. For a single author, (a) is fine: scope the PAT to this one repo, Contents read/write only, and rotate it yearly.

### Options compared (checked 12 Nov 2026)

| Option | Status | Works on Pages with no backend? | Verdict |
|--------|--------|-------------------------------|---------|
| **Sveltia CMS** (sveltiacms.app) | v0.262.x, near-daily releases, MIT | **Yes**: built-in "Sign in with token" (PAT). Optional Cloudflare Worker for OAuth. | **Recommended.** Drop `admin/index.html` + `admin/config.yml` into the repo. Markdown editor with preview, image uploads committed to a media folder, mobile UI, commits are GPG-signed. Decap-compatible config. |
| Decap CMS (ex Netlify CMS) | 3.17.x, MIT, 19k stars | No: GitHub backend needs an OAuth proxy (free Worker) or their hosted "Turbo" (free tier: 1 site, 1 seat) | Mature but strictly more moving parts than Sveltia for the same config. Fallback if Sveltia ever stalls. |
| Pages CMS (pagescms.org) | 2.1.x, MIT | Hosted app (free) commits to your repo via a GitHub App; self-host needs Node + Postgres | Nicest zero-code UX, but you depend on a third-party host. |
| TinaCMS | 3.15.x, Apache-2 | Needs TinaCloud or a self-hosted data layer | Overkill for a plain static site. |
| Keystatic | 0.6.x, MIT | No: GitHub mode needs server routes | Great TS API, not a fit without SSR. |
| Static CMS | archived Sep 2024 | — | Avoid. |
| **Hand-rolled** | ~200 lines TS | **Yes** with a PAT | `PUT /repos/{o}/{r}/contents/{path}` with base64 + `sha` for create/update. Full control, but you own slugs, front-matter forms, sha conflicts and drafts. |

### Decision: Sveltia CMS + free Cloudflare Worker for GitHub OAuth (zero code, zero cost)
Chosen over PAT sign-in so that logging in is a normal "Sign in with GitHub" button and no token ever has to be pasted or rotated.

Setup (about 30 minutes, once):
1. Create a GitHub OAuth App (Settings → Developer settings). Callback URL = the Worker URL.
2. Deploy `sveltia/sveltia-cms-auth` to Cloudflare Workers (free tier: 100k requests/day, this needs ~2 per login). Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `ALLOWED_DOMAINS=mohsengh.com` as Worker secrets.
3. Add `admin/index.html` (loads Sveltia from CDN) and `admin/config.yml` with `backend: { name: github, repo: webgodo/webgodo.github.io, branch: main, base_url: https://<worker>.workers.dev }`.
4. Collections: `articles` (folder `content/articles`, fields: title, date, tags, summary, draft, body) and `profile` (file `content/profile.json`, so the timeline/skills/projects are editable from the same dashboard).
5. `media_folder: public/images/articles` so image uploads are committed next to the posts.

Only the GitHub account(s) with write access to the repo can log in; the Worker holds the OAuth secret so nothing sensitive is in the repo. Every save is a commit to `main`, the Pages workflow redeploys in about a minute. The admin gets a small CSS override so it matches the retro skin.

### Content format
```
content/articles/2026-11-12-my-first-post.md
---
title: My first post
date: 2026-11-12
tags: [react, performance]
summary: One line for the list and OG image.
draft: false
---
Markdown body…
```
Build step: parse frontmatter → `articles.json` → pre-rendered `/articles/:slug` pages + RSS + OG PNG per post. The `draft: true` flag keeps a post committed but unpublished.

---

## 7. Tech stack (all free)

- **Vite + TypeScript**, React for pages and the admin, **plain Canvas 2D for the game** (no engine: ~600 lines for Brick Breaker, and "I wrote the physics myself" is a better hiring story than "I used Phaser"). Phaser 3 or Kaplay are the fallbacks if the Pac-Man easter egg grows.
- **Routing:** React Router with a 404.html redirect trick for GitHub Pages, or static pre-rendering via `vite-plugin-ssr`/Astro if SEO for articles matters (it does: pre-render the article pages).
- **Content:** `content/articles/*.md` with frontmatter; a build step generates `articles.json` and per-article OG images (satori + resvg at build, zero runtime cost).
- **Deploy:** GitHub Actions → Pages on every push to `main`. The admin's commits trigger the same workflow, so publishing an article is: write → save → ~60s → live.
- **Quality bar (hiring signal):** Lighthouse 100/100/100/100, zero console errors, works at 320px, tests for the game physics (Vitest) and one Playwright smoke test. Put the Lighthouse badge in the footer.

---

## 8. Hiring & virality checklist

- **Above the fold without playing:** name, title, years, 4 key techs, Download CV, GitHub, LinkedIn, email. Recruiters bounce in seconds.
- **Share card:** on game over, draw a PNG on canvas ("I broke Mohsen's career in 00:47 • 142 bricks • mohsengh.com"), offer Web Share API on mobile and download/copy on desktop. This is the viral unit.
- **OG image:** a screenshot of the game mid-play with your name in the HUD. Links on LinkedIn/X/Slack must look like a game, not a blank page.
- **Launch post:** 15-second GIF of attract mode → you taking over → a row revealing "Senior Frontend, Oxolo". Post to LinkedIn, X, r/webdev, and "Show HN: I turned my résumé into Brick Breaker". Each has a different tone; prepare three captions.
- **Easter eggs:** Konami code → Pac-Man; typing `sudo hire mohsen` in the terminal page; a `/humans.txt`; console.log banner with a pixel-art "psst, source is on GitHub".
- **Open source the repo** with a good README: "fork this and make your own". Forks = reach.
- **Speed:** no framework on the homepage's critical path beyond what's needed; first paint under 1s on 3G. A slow retro site is a contradiction.
- **"Hire me" state:** a small, honest "Open to senior frontend / full-stack roles, remote, AU timezone" line in the HUD. People share things that help someone.

---

## 9. Roadmap

Status 12 Nov 2026: everything in the roadmap is shipped and live: the arcade site, Pac-Man easter egg "Scope Creep" (`src/game/pacman.ts`), Playwright smoke tests in CI, Lighthouse 100/100/100/100, pixel avatar, launch GIF + MP4 in `design/launch/` (from `scripts/record-launch.mjs`), CV PDF regenerated from `/cv` by `scripts/export-cv.mjs`, Sveltia admin with the Cloudflare auth Worker, and the Pages source switched to GitHub Actions.

### Going live (two one-time steps outside the repo)
1. **GitHub Pages source → GitHub Actions.** The repo currently deploys the `main` branch root (legacy mode). The new site is built by `.github/workflows/deploy.yml`, so in repo Settings → Pages set Source to "GitHub Actions" *before* pushing, or the raw source would be served for a minute.
2. **Done 12 Nov 2026:** `sveltia-cms-auth` is deployed at https://sveltia-cms-auth.webgodo.workers.dev (Cloudflare account webgodo@gmail.com) with `ALLOWED_DOMAINS=mohsengh.com`, and `base_url` is set in `public/admin/config.yml`. The Worker reads `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` from the GitHub App "Sveltia CMS Auth for mohsengh.com" (callback `<worker>/callback`), installed on this repo only.

| Phase | Deliverable | Est. |
|-------|-------------|------|
| 0 | Confirm concept + copy (this doc), gather pixel avatar | 1 day |
| 1 | Vite/TS scaffold, GitHub Actions deploy, retro design system (tokens, fonts, dialog box, CRT layer), `/cv` page from `profile.json` | 2–3 days |
| 2 | Career Breaker: physics, bricks from profile data, reveal animation, touch controls, attract mode, share card | 4–5 days |
| 3 | Timeline, Skills (fun page), Projects pages | 2 days |
| 4 | Articles: markdown pipeline, list + reading view, OG images, RSS | 2 days |
| 5 | Admin dashboard (section 6) | 1–2 days |
| 6 | Polish: sound, Konami easter egg, Lighthouse 100, Playwright smoke test, README, launch GIF | 2–3 days |

---

## 10. Decisions (made 12 Nov 2026)

1. **Hero game:** Career Breaker in a Game Boy/arcade shell, attract mode when idle, Pac-Man easter egg.
2. **Console skin: Arcade cabinet** (neon marquee, dark CRT, attract mode). Mockups of all three remain in `design/skins-preview.html`.
3. **Admin:** Sveltia CMS, hosted from the repo, GitHub OAuth through a free Cloudflare Worker. No PAT, no self-built editor.
4. **Tone:** funny, not silly. Lines are witty observations a senior engineer would say in a good interview, never self-deprecating about competence, no memes, no profanity. Section 4 was rewritten with that bar.
5. **Avatar:** generated from the photo (see `design/avatar/`), then hand-cleaned at 32×32 in the chosen palette.
6. **Removed:** the Bazarko "Network Member" entry is not part of the timeline.
7. **Mobile:** full game on touch; desktop-only extras show a one-time "bigger screen = bonus level" toast.
