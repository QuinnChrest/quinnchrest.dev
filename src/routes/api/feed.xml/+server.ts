import type { RequestHandler } from '@sveltejs/kit';
import { getDevLog } from '$lib/server/content';
import { SITE_URL, categoryLabel } from '$lib/format';
import type { DevLogEntry } from '$lib/types';

export const prerender = true;

export const GET: RequestHandler = () => {
	return new Response(generateRSSFeed(getDevLog().slice(0, 20)), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
};

const cdata = (s: string) => s.replace(/]]>/g, ']]]]><![CDATA[>');

function generateRSSFeed(entries: DevLogEntry[]): string {
	// lastBuildDate tracks the newest entry, not the build time, so the feed
	// only changes when content does.
	const lastBuild = new Date(entries[0]?.date ?? Date.now()).toUTCString();

	const items = entries
		.map((entry) => {
			const link = `${SITE_URL}/log/${entry.slug}`;
			// The guid predates entry pages and must never change, or feed readers
			// will show every old entry as new. It is not a working URL.
			return `
		<item>
			<guid isPermaLink="false">${SITE_URL}/devlog/${entry.id}</guid>
			<link>${link}</link>
			<title><![CDATA[${cdata(entry.title)}]]></title>
			<pubDate>${new Date(entry.date).toUTCString()}</pubDate>
			<category>${categoryLabel[entry.category]}</category>
			<description><![CDATA[${cdata(entry.html)}]]></description>
			<dc:creator>Quinn Chrest</dc:creator>
			<dc:subject>${entry.tags.join(', ')}</dc:subject>
		</item>`;
		})
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Quinn Chrest - Dev Log</title>
		<atom:link href="${SITE_URL}/api/feed.xml" rel="self" type="application/rss+xml" />
		<link>${SITE_URL}/log</link>
		<description>Development updates, learnings, and insights from Quinn Chrest's side projects</description>
		<lastBuildDate>${lastBuild}</lastBuildDate>
		<language>en-US</language>
		<generator>quinnchrest.dev</generator>${items}
	</channel>
</rss>`;
}
