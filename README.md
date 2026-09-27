# Quinn Chrest - Developer Portfolio

Source for [quinnchrest.dev](https://quinnchrest.dev): a projects showcase, dev log (with RSS feed), and live GitHub stats. Built with SvelteKit, TypeScript, and Tailwind CSS, and published as a fully static site on GitHub Pages. There's no server and no database; all content lives in Markdown files in this repo.

## ✍️ Adding content

Add a Markdown file, commit, and push to `main`. The site rebuilds and deploys automatically.

### Dev log entry: `src/content/devlog/<YYYY-MM-DD>-<slug>.md`

```md
---
id: 6                     # unique number; used as the RSS <guid>, never change it once published
title: "My new entry"
date: 2025-08-01
category: feature         # feature | bug-fix | learning | update
tags: ["SvelteKit", "GitHub Pages"]
---
Entry text goes here. Line breaks are preserved.
```

### Project: `src/content/projects/<slug>.md`

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

`.github/workflows/deploy.yml` builds the site with `@sveltejs/adapter-static` and deploys it to GitHub Pages on every push to `main`. It can also be run manually from the Actions tab.

Every route is prerendered, including the RSS feed (`/api/feed.xml`) and `/sitemap.xml`. `static/CNAME` sets the custom domain.

One-time repo setup: **Settings → Pages → Source: GitHub Actions**, then set the custom domain to `quinnchrest.dev` and enable **Enforce HTTPS**.

## 📞 Contact

- **Website**: [quinnchrest.dev](https://quinnchrest.dev)
- **GitHub**: [@quinnchrest](https://github.com/quinnchrest)
- **LinkedIn**: [Quinn Chrest](https://linkedin.com/in/quinnchrest)
