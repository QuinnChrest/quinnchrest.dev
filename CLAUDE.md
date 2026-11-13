# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- Every project note or changelog note you write must include the disclaimer "This post was written using generative AI." at the top of the note body.

## Commands

- `npm run dev`: dev server
- `npm run build`: static build into `build/` (this is also the best end-to-end check: prerendering fails on broken links or non-prerenderable routes)
- `npm run preview`: serve the built site
- `npm run check`: `svelte-kit sync` + `svelte-check` type checking
- `npm run icons`: regenerate `static/favicon.svg`, `favicon-32.png` and `apple-touch-icon.png` from `scripts/icons.mjs` (the orange trail dot on Topo green). The outputs are committed; only rerun when the design changes.

There is no test suite or linter.

## Architecture

Personal portfolio for quinnchrest.dev: SvelteKit 2 + Svelte 5 + TypeScript, built as a fully static site with `@sveltejs/adapter-static` (`strict: true`) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. No server, no database, no admin panel.

- **Everything is prerendered.** `src/routes/+layout.ts` sets `prerender = true`; every new route must be prerenderable or the build fails.
- **Content is Markdown in the repo.** `src/lib/server/content.ts` bundles `src/content/projects/*.md`, `src/content/notes/<project>/*.md` and `src/content/changelog/*.md` at build time via `import.meta.glob(..., { query: '?raw', eager: true })`, parses frontmatter with `gray-matter`, and renders bodies to HTML with `marked` (GFM, `breaks: true`). Types are in `src/lib/types.ts`. Adding content = adding a file (frontmatter formats are documented in `README.md`).
- **Routes:** `/` (home), `/projects`, `/projects/[slug]`, `/projects/[slug]/[note]`, `/notes` (every project note), `/changelog`, `/changelog/[slug]`, plus `+error.svelte` (built as `404.html` via the adapter `fallback`). Project slugs are the file name; note slugs are the file name without the `YYYY-MM-DD-` prefix. Slugs are URLs, so don't rename content files once published. `NotePage.svelte` and `NotesIndex.svelte` are shared by the project note and changelog routes. There is no RSS feed (it was removed on purpose).
- **Design:** the "Topo" theme. Plain CSS (no Tailwind): global tokens and `.prose` styles in `src/app.css`, component styles scoped in each `.svelte` file. Dark by default; `ThemeToggle.svelte` switches to light via `data-theme="light"` on `<html>` (applied before paint by a script in `src/app.html`). `Topo.svelte` draws the contour background from a seed, server-side: `src/lib/topo.ts` builds one height field from a few hills and traces contour lines with marching squares, so lines never cross (like a real map). Don't go back to drawing independent rings per peak; they overlap.
- **Stats:** `src/lib/server/github.ts` fetches GitHub numbers at build time (using `GITHUB_TOKEN` if set, returning null on failure so the build never breaks); `Stats.svelte` shows those and refreshes them in the browser, cached in localStorage for an hour.
- **Sitemap:** `src/routes/sitemap.xml/+server.ts` (every page) is a prerendered endpoint. Base URL is `SITE_URL` in `src/lib/format.ts`. `static/CNAME` sets the custom domain.
- **Search:** `src/routes/search.json/+server.ts` prerenders an index of every project and note; `Search.svelte` (header button, `/` or Ctrl/Cmd+K) downloads it on first open and ranks results with `src/lib/search.ts`. No server or third-party service.
- **Share images:** `src/routes/og/[group]/[slug].png` (one per note; `group` is the project slug, or `changelog`) and `src/routes/og/site.png` (everything else) are prerendered PNGs drawn by `src/lib/server/og.ts` with satori + resvg, using font files from `@fontsource` packages and `static/avatar.jpg`. `Seo.svelte` uses `summary_large_image` for these.
- **Deploys:** on every push to `main`, and daily at 11:17 UTC via `schedule` in the workflow so build-time GitHub stats stay fresh (scheduled runs only fire on the default branch).
- **Recent photos:** `src/lib/server/photos.ts` reads `src/data/photos.json` from the photos.quinnchrest.dev repo on GitHub at build time (that site bundles it rather than publishing it) and the home page shows the newest six. Clicking one opens it in an on-page viewer (`PhotoStrip.svelte`); the links still point to `https://photos.quinnchrest.dev/#/p/<id>` for new tabs and no-JS. If the fetch fails the strip is left out.
- **Blog:** `src/lib/server/blog.ts` reads the micro.blog JSON Feed at `https://quinnchrest.com/feed.json` at build time; the home page "Trail log" shows the newest five as a `Trail` linking out. Most posts are untitled, so the text is the headline. If the fetch fails the section is left out.
- **Animations** (all skipped when the system asks for reduced motion, and nothing is hidden without JS): `Trail.svelte` draws its line and pops in each stop the first time it scrolls into view (the `reveal` action in `src/lib/reveal.ts` sets `data-reveal`; style it with `:global([data-reveal])` or Svelte strips the selectors). `Topo.svelte` traces the contour lines on the first page of a visit (`draw-topo` class set in `src/app.html`, removed on the first navigation). Page changes use the View Transitions API from `onNavigate` in `+layout.svelte`; project images morph between the card and project page via matching `view-transition-name: project-<slug>`, which must stay unique per page.
- **Trail.svelte** takes generic `TrailItem`s (`noteToTrail` in `src/lib/format.ts` converts notes), so it renders both notes and blog posts.
- `mockups/` holds static HTML design mock-ups from the redesign. It is not part of the build.

## Content conventions

- Project notes: `src/content/notes/<project-slug>/<YYYY-MM-DD>-<slug>.md`; the folder must match a file in `src/content/projects/` or the build fails. Notes about the site itself go in `src/content/changelog/<YYYY-MM-DD>-<slug>.md`. Frontmatter: `title`, `date`, `category` (`feature | bug-fix | learning | update`), `tags`, optional `draft`. No `id` (that was only for RSS). `draft: true` or a future `date` keeps a note out of the build (it still shows, labeled, in `npm run dev`); the daily deploy publishes future-dated notes on their date. Two notes can't share a URL, drafts included.
- Note bodies are Markdown. Single line breaks are kept. A short plain line directly followed by a `- ` list is styled as a subheading, which is how existing entries are written; `##` headings, links, bold and code also work. The first paragraph after the AI disclaimer becomes the excerpt shown on cards and in meta descriptions, so make it a good summary.
- Projects have an optional `kind`: `ai | game | web | tool` (`PROJECT_KINDS` in `src/lib/types.ts`; anything else fails the build). It drives the card label and the projects page filter.
- Projects are sorted featured-first, then by descending numeric `id`. `status` is `completed | in-progress | planned`; `image` falls back to a default Unsplash image.
