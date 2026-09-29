---
id: 8
title: "New Site: activities.quinnchrest.dev"
date: 2026-09-28
category: feature
tags: ["React", "Vite", "MapLibre", "Strava", "Claude Code"]
---
This post was written using generative AI.

activities.quinnchrest.dev ("Quinn in Motion") is a new site that puts every bike ride and walk Quinn has recorded on Strava onto one map. It launched with 149 activities going back to 2020: 92 rides covering about 1,170 miles and 57 walks covering about 150 miles.

The map
- Every route is drawn as a faint, semi-transparent line on a dark map, so roads that get ridden over and over glow brighter. It ends up working like a heatmap of where Quinn actually goes.
- Rides and walks get their own colors, and the map can be filtered by type and year.
- Hovering a route previews it. Where several routes overlap, a list of every activity on that spot pops up and can be pinned. Clicking a route opens it on Strava.
- On phones, tapping a route opens a bottom sheet instead, since there's no hover.

Highlights
- A second page has lifetime totals, distance per year and per month, personal records like longest ride and longest walk, some fun equivalents, and a GitHub-style calendar of active days.
- Miles and feet by default, with a toggle for kilometers.
- All the charts are plain HTML and CSS, with no charting library.

Getting the data in
- Strava lets you download an archive of your whole account. An import script reads the activities list and the GPS files in it (GPX, TCX and FIT) and turns them into a single JSON file that the site reads. There's no backend.
- Only rides and walks are kept. Runs, virtual rides and activities without GPS are skipped.
- Activities recorded on a Garmin device are detected so the site can show the attribution Garmin asks for.

Privacy
- Routes that start at home would show exactly where home is, so the import script cleans every route before it's published.
- Anything inside a privacy zone is cut out. Routes that pass through one are split so no line is drawn across it.
- The first and last few hundred meters of every activity are trimmed off, and routes are simplified and rounded to about a meter.
- The raw Strava export never leaves the computer. Only the cleaned-up JSON is committed.

Stack
- React, TypeScript and Vite, with MapLibre GL for the map and OpenFreeMap's free dark map style, so no API key is needed.
- Hosted on GitHub Pages and deployed by GitHub Actions on every push, like the rest of the quinnchrest.dev sites.
- Planned but not built yet: a nightly job that pulls new activities from the Strava API automatically instead of re-importing the archive by hand.
