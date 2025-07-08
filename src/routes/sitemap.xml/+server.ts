import type { RequestHandler } from '@sveltejs/kit';
import pool from '$lib/db';

export const GET: RequestHandler = async () => {
	try {
		const client = await pool.connect();
		
		// Get devlog entries for sitemap
		const devlogQuery = `
			SELECT id, date FROM devlog 
			ORDER BY date DESC
		`;
		
		const devlogResult = await client.query(devlogQuery);
		client.release();
		
		const baseUrl = 'https://quinnchrest.dev';
		const currentDate = new Date().toISOString();
		
		// Generate sitemap XML
		const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${baseUrl}</loc>
		<lastmod>${currentDate}</lastmod>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	${devlogResult.rows.map((row: any) => `
	<url>
		<loc>${baseUrl}/devlog/${row.id}</loc>
		<lastmod>${new Date(row.date).toISOString()}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>`).join('')}
</urlset>`;
		
		return new Response(sitemapXml, {
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (error) {
		console.error('Error generating sitemap:', error);
		return new Response('Error generating sitemap', { status: 500 });
	}
}; 