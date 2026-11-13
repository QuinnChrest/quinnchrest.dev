import type { RequestHandler } from '@sveltejs/kit';
import { getAllPublishedNotes, getChangelog, getNotes, getNotesForProject, getProjects } from '$lib/server/content';
import { SITE_URL } from '$lib/format';

export const prerender = true;

export const GET: RequestHandler = () => {
	// lastmod values come from content dates, not the build time, so crawlers
	// only see a change when content actually changes.
	const day = (iso?: string) => iso?.slice(0, 10);
	const urls: { loc: string; lastmod?: string }[] = [
		{ loc: '/', lastmod: day(getNotes()[0]?.date) },
		{ loc: '/projects', lastmod: day(getNotes()[0]?.date) },
		{ loc: '/notes', lastmod: day(getNotes()[0]?.date) },
		{ loc: '/changelog', lastmod: day(getChangelog()[0]?.date) },
		...getProjects().map((p) => ({ loc: `/projects/${p.slug}`, lastmod: day(getNotesForProject(p.slug)[0]?.date) })),
		...getAllPublishedNotes().map((n) => ({ loc: n.url, lastmod: day(n.date) }))
	];

	const body = urls
		.map(
			(u) => `	<url>
		<loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `\n		<lastmod>${u.lastmod}</lastmod>` : ''}
	</url>`
		)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`,
		{ headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
	);
};
