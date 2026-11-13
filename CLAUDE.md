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
- **Content is Markdown in the repo.** `src/lib/server/content.ts` bundles `src/content/projects/*.md` and `src/content/devlog/*.md` at build time via `import.meta.glob(..., { query: '?raw', eager: true })`, parses frontmatter with `gray-matter`, and renders bodies to HTML with `marked` (GFM, `breaks: true`). Types are in `src/lib/types.ts`. Adding content = adding a file (frontmatter formats are documented in `README.md`).
- **Routes:** `/` (home), `/projects`, `/projects/[slug]`, `/log`, `/log/[slug]`, plus `+error.svelte` (built as `404.html` via the adapter `fallback`). Project slugs are the file name; dev log slugs are the file name without the `YYYY-MM-DD-` prefix. Slugs are URLs, so don't rename content files once published.
- **Design:** the "Topo" theme. Plain CSS (no Tailwind): global tokens and `.prose` styles in `src/app.css`, component styles scoped in each `.svelte` file. Light/dark follows the system, and `ThemeToggle.svelte` overrides it via `data-theme` on `<html>` (applied before paint by a script in `src/app.html`). `Topo.svelte` draws the contour background from a seed, server-side.
- **Stats:** `src/lib/server/github.ts` fetches GitHub numbers at build time (using `GITHUB_TOKEN` if set, returning null on failure so the build never breaks); `Stats.svelte` shows those and refreshes them in the browser, cached in localStorage for an hour.
- **Feeds:** `src/routes/api/feed.xml/+server.ts` (RSS, latest 20 dev log entries, rendered HTML) and `src/routes/sitemap.xml/+server.ts` (every page) are prerendered endpoints. Base URL is `SITE_URL` in `src/lib/format.ts`. `static/CNAME` sets the custom domain.
- `mockups/` holds static HTML design mock-ups from the redesign. It is not part of the build.

## Content conventions

- Dev log files: `src/content/devlog/<YYYY-MM-DD>-<slug>.md`. `id` must be unique and increment from the highest existing one; it is used in the RSS `<guid>` (`https://quinnchrest.dev/devlog/<id>`, not a real URL), so never change it once published. `category` is one of `feature | bug-fix | learning | update`. Optional `project: <project-slug>` links the entry to a project page.
- Dev log bodies are Markdown. Single line breaks are kept. A short plain line directly followed by a `- ` list is styled as a subheading, which is how existing entries are written; `##` headings, links, bold and code also work. The first paragraph after the AI disclaimer becomes the excerpt shown on cards and in meta descriptions, so make it a good summary.
- Projects are sorted featured-first, then by descending numeric `id`. `status` is `completed | in-progress | planned`; `image` falls back to a default Unsplash image.
