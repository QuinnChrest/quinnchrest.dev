# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- Every dev log post you write must include the disclaimer "This post was written using generative AI." at the top of the entry body.

## Commands

- `npm run dev`: dev server
- `npm run build`: static build into `build/` (this is also the best end-to-end check: prerendering fails on broken links or non-prerenderable routes)
- `npm run preview`: serve the built site
- `npm run check`: `svelte-kit sync` + `svelte-check` type checking

There is no test suite or linter.

## Architecture

Personal portfolio for quinnchrest.dev: SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 3, built as a fully static site with `@sveltejs/adapter-static` (`strict: true`) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. No server, no database, no admin panel.

- **Everything is prerendered.** `src/routes/+layout.ts` sets `prerender = true`; every new route must be prerenderable or the build fails.
- **Content is Markdown in the repo.** `src/lib/server/content.ts` bundles `src/content/projects/*.md` and `src/content/devlog/*.md` at build time via `import.meta.glob(..., { query: '?raw', eager: true })` and parses frontmatter with `gray-matter`. Types are in `src/lib/types.ts`. Adding content = adding a file (frontmatter formats are documented in `README.md`).
- **Single page app shell.** `src/routes/+page.svelte` is the only page; it switches between Projects / DevLog / Stats sections (nav, arrow keys, swipe) with data from `+page.server.ts`. Dev log entries have no individual URLs.
- **Stats** (`src/lib/components/Stats.svelte`) fetches the GitHub API client-side at runtime; it is the only non-static data.
- **Feeds:** `src/routes/api/feed.xml/+server.ts` (RSS, latest 20 dev log entries) and `src/routes/sitemap.xml/+server.ts` (single URL, `lastmod` = newest dev log date) are prerendered endpoints. Base URL `https://quinnchrest.dev` is hardcoded in both. `static/CNAME` sets the custom domain.

## Content conventions

- Dev log files: `src/content/devlog/<YYYY-MM-DD>-<slug>.md`. `id` must be unique and increment from the highest existing one; it is the RSS `<guid>`, so never change it once published. `category` is one of `feature | bug-fix | learning | update`.
- Dev log bodies are rendered as plain text with `white-space: pre-line` (and newlines become `<br>` in RSS), not as Markdown. Write plain paragraphs and `- ` lines; avoid Markdown formatting like headings, bold, or links.
- Projects are sorted featured-first, then by descending numeric `id`. `status` is `completed | in-progress | planned`; `image` falls back to a default Unsplash image.
