# Quinn Chrest - Developer Portfolio

Source for [quinnchrest.dev](https://quinnchrest.dev): a projects showcase with notes on each project, recent photos and blog posts, and GitHub stats. Built with SvelteKit and TypeScript, and published as a fully static site on GitHub Pages. There's no server and no database; all content lives in Markdown files in this repo.

## ✍️ Adding content

Add a Markdown file, commit, and push to `main`. The site rebuilds and deploys automatically.

### Project note: `src/content/notes/<project-slug>/<YYYY-MM-DD>-<slug>.md`

Published at `/projects/<project-slug>/<slug>` and listed on the project's page and at `/notes`. The folder name must match a project file.

```md
---
title: "My new note"
date: 2025-08-01
category: feature         # feature | bug-fix | learning | update
tags: ["SvelteKit", "GitHub Pages"]
draft: true               # optional: keep it off the site while writing
---
Note text goes here, in Markdown. Line breaks are preserved.
The first paragraph is used as the summary on cards and in search results.
```

### Changelog note: `src/content/changelog/<YYYY-MM-DD>-<slug>.md`

Same format, for notes about this website itself. Published at `/changelog/<slug>`.

Drafts and notes dated in the future aren't built (no page or search result) but do show up, labeled, in `npm run dev`. A future-dated note goes live with the daily deploy on its date, so you can schedule notes by committing them early.

### Photos and blog posts

These aren't in this repo. The home page reads the newest photos from the [photos site's repo](https://github.com/QuinnChrest/photos.quinnchrest.dev) and the newest posts from the micro.blog feed at [quinnchrest.com](https://quinnchrest.com) each time the site builds.

### Project: `src/content/projects/<slug>.md`

Published at `/projects/<slug>`.

```md
---
id: 39                    # higher ids are listed first (after featured projects)
title: "My Project"
status: completed         # completed | in-progress | planned
kind: game                # optional: ai | game | web | tool (label and filter)
featured: false
image: "https://example.com/thumbnail.png"
technologies: ["SvelteKit", "TypeScript"]
githubUrl: "https://github.com/QuinnChrest/my-project"   # optional
liveUrl: "https://my-project.vercel.app"                  # optional
---
Short project description.
```

Content is loaded at build time by `src/lib/server/content.ts`.

## 🔧 Development

- `npm run dev`: start the dev server
- `npm run build`: build the static site into `build/`
- `npm run preview`: serve the built site locally
- `npm run check`: type-check the project

## 🚀 Deployment

`.github/workflows/deploy.yml` builds the site with `@sveltejs/adapter-static` and deploys it to GitHub Pages on every push to `main` and once a day (to refresh the GitHub stats, photos and blog posts, and publish scheduled notes). It can also be run manually from the Actions tab.

Every route is prerendered, including `/sitemap.xml`, the search index (`/search.json`) and a share image for each note (`/og/<project-slug>/<slug>.png`). GitHub stats are fetched during the build (with the workflow's `GITHUB_TOKEN`) and refreshed in the browser. `static/CNAME` sets the custom domain.

One-time repo setup: **Settings → Pages → Source: GitHub Actions**, then set the custom domain to `quinnchrest.dev` and enable **Enforce HTTPS**.

## 📞 Contact

- **Website**: [quinnchrest.dev](https://quinnchrest.dev)
- **GitHub**: [@quinnchrest](https://github.com/quinnchrest)
- **Blog**: [quinnchrest.com](https://quinnchrest.com)
- **LinkedIn**: [Quinn Chrest](https://www.linkedin.com/in/quinn-chrest-533581140/)
