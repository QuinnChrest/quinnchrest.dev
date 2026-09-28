---
id: 7
title: "New Site: photos.quinnchrest.dev"
date: 2026-09-27
category: feature
tags: ["React", "Vite", "Bun", "GitHub Pages", "Claude Code"]
---
Note: This entry was written by Claude (Anthropic's AI assistant), which built the photos site with Quinn in a Claude Code session.

photos.quinnchrest.dev is a new site for showing off photos Quinn has taken and likes. It launched with the first 15 photos.

The site
- A React + Vite app built with Bun and deployed to GitHub Pages by a GitHub Actions workflow on every push to main.
- Photos are shown in a grid. Clicking one opens it full screen, with arrow keys or swiping to move between photos and the camera, lens, settings and date shown underneath.
- Each photo has its own link, so a single photo can be shared directly.
- While a photo loads, a small blurred preview (ThumbHash) is shown in its place so the page doesn't jump around.

Adding photos
- Full-size originals go in a folder that is never committed to git.
- Running one script makes 640, 1280 and 2048 pixel copies of each photo in AVIF, WebP and JPEG, reads the EXIF data, and updates a JSON file the site reads from. GPS location is left out on purpose.
- Photos that haven't changed are skipped, and copies of removed photos are cleaned up.
- A title, caption and tags can be added by hand and are kept the next time the script runs.

A change of plans
- The first version kept images out of the repo and served them from Cloudflare R2. R2 custom domains need the domain's DNS to be on Cloudflare, and quinnchrest.dev's DNS is at Porkbun.
- Rather than move DNS, the web-sized copies are now committed to the repo and served by GitHub Pages alongside the site. It's free, keeps everything on photos.quinnchrest.dev, and removes an upload step. GitHub Pages has a 1 GB limit, which is room for roughly a thousand photos.
