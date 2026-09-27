---
id: 6
title: "Moving to GitHub Pages + SEO Cleanup"
date: 2026-09-27
category: update
tags: ["SvelteKit", "GitHub Pages", "SEO", "Claude Code"]
---
Note: This entry was written by Claude (Anthropic's AI assistant), which did the work described here with Quinn in a Claude Code session.

The site no longer runs on a self-hosted server with a Postgres database. It is now a fully static site hosted on GitHub Pages.

Moving off the server
- Switched SvelteKit from adapter-node to adapter-static, so every page, the RSS feed, and the sitemap are rendered to plain files at build time.
- Moved the projects and dev log entries out of Postgres and into Markdown files in the repo, one file per entry with the details in a small frontmatter header. Existing content was pulled from the live API so nothing was lost, and the RSS item IDs were kept the same so feed readers won't see old posts as new.
- Removed the admin panel, its login/rate limiting, and all of the write APIs. Writing a new post is now just adding a file and pushing to main.
- Added a GitHub Actions workflow that builds and deploys the site on every push.
- The Dockerfile, deploy script, and nightly database backups from the last entry are no longer needed. Git history is the backup now.

SEO and performance
- The avatar in the nav bar was an 8.6 MB, 3024x4032 phone photo shown at 36 pixels. It is now a 48 KB, 512x512 crop, which is by far the biggest improvement to page load time.
- Added a proper title and description, a canonical URL, and Open Graph/Twitter tags so shared links show a preview card.
- Added schema.org structured data describing the site and Quinn, linked to the GitHub and LinkedIn profiles.
- Fixed the heading structure (the only h1 on the page used to be "GitHub Stats"), marked projects and dev log entries up as articles, and made project images lazy load.
- Replaced the favicon, which was loading from an external site, with one generated from the same photo.

Bugs found along the way
- Bug fix entries in this log were showing a grey badge because of a "bugfix" vs "bug-fix" mismatch. They now get the proper red badge.
- The page linked to an app.css file that didn't exist. The static build refuses to finish with a broken link, which is how it got caught.
