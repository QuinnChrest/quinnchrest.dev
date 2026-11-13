# Quinn Chrest - Developer Portfolio

Source for [quinnchrest.dev](https://quinnchrest.dev): a projects showcase, dev log (with RSS feed), and GitHub stats. Built with SvelteKit and TypeScript, and published as a fully static site on GitHub Pages. There's no server and no database; all content lives in Markdown files in this repo.

## ✍️ Adding content

Add a Markdown file, commit, and push to `main`. The site rebuilds and deploys automatically.

### Dev log entry: `src/content/devlog/<YYYY-MM-DD>-<slug>.md`

Published at `/log/<slug>`.

```md
---
id: 6                     # unique number; used as the RSS <guid>, never change it once published
title: "My new entry"
date: 2025-08-01
category: feature         # feature | bug-fix | learning | update
tags: ["SvelteKit", "GitHub Pages"]
project: hey-leo          # optional: the project file this entry is about
---
Entry text goes here, in Markdown. Line breaks are preserved.
The first paragraph is used as the summary on cards and in search results.
```

### Project: `src/content/projects/<slug>.md`

Published at `/projects/<slug>`.

```md
---
id: 39                    # higher ids are listed first (after featured projects)
title: "My Project"
status: completed         # completed | in-progress | planned
featured: false
image: "https://example.com/thumbnail.png"
technologies: ["Svelte", "TypeScript"]
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

`.github/workflows/deploy.yml` builds the site with `@sveltejs/adapter-static` and deploys it to GitHub Pages on every push to `main` and once a day (to refresh the GitHub stats). It can also be run manually from the Actions tab.

Every route is prerendered, including the RSS feed (`/api/feed.xml`), `/sitemap.xml`, the search index (`/search.json`) and a share image for each dev log entry (`/og/<slug>.png`). GitHub stats are fetched during the build (with the workflow's `GITHUB_TOKEN`) and refreshed in the browser. `static/CNAME` sets the custom domain.

One-time repo setup: **Settings → Pages → Source: GitHub Actions**, then set the custom domain to `quinnchrest.dev` and enable **Enforce HTTPS**.

## 📞 Contact

- **Website**: [quinnchrest.dev](https://quinnchrest.dev)
- **GitHub**: [@quinnchrest](https://github.com/quinnchrest)
- **LinkedIn**: [Quinn Chrest](https://www.linkedin.com/in/quinn-chrest-533581140/)
