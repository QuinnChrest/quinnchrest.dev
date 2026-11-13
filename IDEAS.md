# Feature ideas

Ideas for quinnchrest.dev that came up during the 2026 redesign but haven't been built. Everything here keeps the site static on GitHub Pages with content in this repo. Move an item to a project note or the changelog once it ships.

## Data that's still placeholder

- **Real ride stats.** Show miles and rides from Quinn in Motion in the stats. The activities site doesn't publish its totals in a readable form, so it would first need to commit a small summary JSON (like the photos site's `photos.json`) for this site to read at build time.
- **Real map lines.** Draw one of the background maps from actual elevation data around Minneapolis, or from ride routes, instead of generated hills.

## New pages and sections

- **Ask Leo page** (`/leo`). The Hey Leo lion gives a tour as a chat: visitors tap a question and Leo answers with text and project cards. Answers are written ahead of time from the site's content, so no AI runs on the page. Mock-up: `mockups/i-ask-leo.html` on the `archive/redesign-mockups` branch.
- **Now page** (`/now`). A short "what I'm working on, reading and riding these days" page, updated by editing one Markdown file.
- **Tag pages** like `/notes/tag/claude-code` that collect notes sharing a tag. Tags already exist on every note.
- **"Currently building" line** on the home page, pulled automatically from in-progress projects and their latest note.

## Content and polish

- **Real project images.** Blackjack, Snake and To Go still use stock Unsplash photos. Screenshots stored in `static/projects/` would look more personal and load faster.
- **Code highlighting** in notes, done at build time (for example with Shiki), so it adds nothing for visitors.
- **Send notes to micro.blog.** micro.blog can repost from a feed, so new project notes would also appear on quinnchrest.com. This needs a feed again (the RSS feed was removed in the redesign); a JSON Feed of notes would be enough.
- **Outside links in the same tab.** External links (GitHub, blog, LinkedIn, live projects) currently open new tabs. Same-tab links with the existing ↗ marker would keep the back button working and behave better on phones.

## Smaller animation extras

- The stats numbers count up and the elevation line draws left to right when they scroll into view (best once the chart shows real data).
- Photos in "From the trail" drop in one after another, like snapshots being set down.
- Search results fade in one after another as you type.
