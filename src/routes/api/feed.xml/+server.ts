import type { RequestHandler } from '@sveltejs/kit';
import pool from '$lib/db';

export const GET: RequestHandler = async () => {
	try {
		const client = await pool.connect();
		
		const query = `
			SELECT 
				id,
				title,
				date,
				category,
				content,
				tags
			FROM devlog 
			ORDER BY date DESC
			LIMIT 20
		`;
		
		const result = await client.query(query);
		client.release();
		
		// Transform the data for RSS
		const devlogEntries = result.rows.map((row: any) => ({
			id: row.id.toString(),
			title: row.title,
			date: row.date,
			content: row.content,
			tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
			category: getCategoryFromNumber(row.category)
		}));
		
		// Generate RSS XML
		const rssXml = generateRSSFeed(devlogEntries);
		
		return new Response(rssXml, {
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (error) {
		console.error('Error generating RSS feed:', error);
		return new Response('Error generating RSS feed', { status: 500 });
	}
};

function getCategoryFromNumber(categoryNum: number): string {
	switch (categoryNum) {
		case 1: return 'Feature';
		case 2: return 'Bug Fix';
		case 3: return 'Learning';
		default: return 'Update';
	}
}

function generateRSSFeed(entries: any[]): string {
	const baseUrl = 'https://quinnchrest.dev';
	const currentDate = new Date().toUTCString();
	
	const rssItems = entries.map(entry => {
		const pubDate = new Date(entry.date).toUTCString();
		const category = entry.category;
		const tags = entry.tags.join(', ');
		
		return `
			<item>
				<guid>${baseUrl}/devlog/${entry.id}</guid>
				<title><![CDATA[${entry.title}]]></title>
				<link>${baseUrl}/devlog/${entry.id}</link>
				<pubDate>${pubDate}</pubDate>
				<category>${category}</category>
				<description><![CDATA[${entry.content}]]></description>
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