---
title: "Hello, world: why my résumé is a game"
date: 2026-11-12
tags: [meta, frontend]
summary: "Why I rebuilt mohsengh.com as an arcade cabinet, what it's made of, and what I learned about Canvas, GitHub Pages and keeping a site at $0."
draft: false
---

Most portfolio sites are a PDF with a navigation bar. I wanted mine to be something you'd actually *play*, and then send to a friend.

## The stack

- **Vite + React + TypeScript** for the pages and the admin.
- **Plain Canvas 2D** for the game. No engine. Brick Breaker is a few hundred lines once you stop over-engineering it.
- **Markdown in the repo** for articles, edited through [Sveltia CMS](https://sveltiacms.app). Every post is a commit.
- **GitHub Pages** and a free Cloudflare Worker for OAuth. Total hosting cost: $0.

## Why Brick Breaker

A brick wall is a grid, and a career is a grid: rows are years, columns are months. Breaking a row reveals the job. The mapping was too neat to pass up.

```ts
// The whole reveal mechanic, honestly.
if (row.bricksLeft === 0) reveal(row.job);
```

More soon. Press START.
