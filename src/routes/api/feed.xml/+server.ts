import type { RequestHandler } from '@sveltejs/kit';
import { getDevLog } from '$lib/server/content';
import type { DevLogEntry } from '$lib/types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const rssXml = generateRSSFeed(getDevLog().slice(0, 20));

	return new Response(rssXml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
};

function getCategoryLabel(category: DevLogEntry['category']): string {
	switch (category) {
		case 'feature': return 'Feature';
		case 'bug-fix': return 'Bug Fix';
		case 'learning': return 'Learning';
		default: return 'Update';
	}
}

function generateRSSFeed(entries: DevLogEntry[]): string {
	const baseUrl = 'https://quinnchrest.dev';
	const currentDate = new Date().toUTCString();
	
	const rssItems = entries.map(entry => {
		const pubDate = new Date(entry.date).toUTCString();
		const category = getCategoryLabel(entry.category);
		const tags = entry.tags.join(', ');
		
		// Add link back in when I have a way to link to the devlog page
		// <link>${baseUrl}/devlog/${entry.id}</link>

		return `
			<item>
				<guid>${baseUrl}/devlog/${entry.id}</guid>
				<title><![CDATA[${entry.title}]]></title>
				<pubDate>${pubDate}</pubDate>
				<category>${category}</category>
				<description><![CDATA[${entry.content.replace(/\n/g, '<br>')}]]></description>
				<dc:creator>Quinn Chrest</dc:creator>
				<dc:subject>${tags}</dc:subject>
			</item>
		`;
	}).join('');
	
	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
	xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
	<channel>
		<title>Quinn Chrest - Dev Log</title>
		<atom:link href="${baseUrl}/api/feed.xml" rel="self" type="application/rss+xml" />
		<link>${baseUrl}</link>
		<description>Development updates, learnings, and insights from Quinn Chrest's coding journey</description>
		<lastBuildDate>${currentDate}</lastBuildDate>
		<language>en-US</language>
		<sy:updatePeriod>daily</sy:updatePeriod>
		<sy:updateFrequency>1</sy:updateFrequency>
		<generator>Quinn Chrest Portfolio</generator>
		${rssItems}
	</channel>
</rss>`;
} 