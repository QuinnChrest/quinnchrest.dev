import type { RequestHandler } from '@sveltejs/kit';
import { getDevLog } from '$lib/server/content';

export const prerender = true;

export const GET: RequestHandler = () => {
	const baseUrl = 'https://quinnchrest.dev';

	// lastmod tracks the newest dev log entry, not the build time, so crawlers
	// only see a change when content actually changes.
	const latestEntry = getDevLog()[0];
	const lastmod = (latestEntry ? latestEntry.date : new Date().toISOString()).slice(0, 10);

	// The site is a single page; dev log entries don't have their own URLs.
	const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${baseUrl}/</loc>
		<lastmod>${lastmod}</lastmod>
	</url>
</urlset>`;

	return new Response(sitemapXml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
};
