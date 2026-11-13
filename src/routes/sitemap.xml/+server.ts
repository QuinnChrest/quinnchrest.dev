import type { RequestHandler } from '@sveltejs/kit';
import { getDevLog, getEntriesForProject, getProjects } from '$lib/server/content';
import { SITE_URL } from '$lib/format';

export const prerender = true;

export const GET: RequestHandler = () => {
	const entries = getDevLog();
	// lastmod values come from content dates, not the build time, so crawlers
	// only see a change when content actually changes.
	const newest = (entries[0]?.date ?? new Date().toISOString()).slice(0, 10);

	const urls: { loc: string; lastmod?: string }[] = [
		{ loc: '/', lastmod: newest },
		{ loc: '/projects' },
		{ loc: '/log', lastmod: newest },
		...getProjects().map((p) => ({
			loc: `/projects/${p.slug}`,
			lastmod: getEntriesForProject(p.slug)[0]?.date.slice(0, 10)
		})),
		...entries.map((e) => ({ loc: `/log/${e.slug}`, lastmod: e.date.slice(0, 10) }))
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
