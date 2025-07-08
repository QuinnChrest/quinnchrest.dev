import { json } from '@sveltejs/kit';
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
		`;
		
		const result = await client.query(query);
		client.release();
		
		// Transform the data to match the expected format
		const devlogEntries = result.rows.map((row: any) => ({
			id: row.id.toString(),
			title: row.title,
			date: row.date,
			content: row.content,
			tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
			category: getCategoryFromNumber(row.category)
		}));
		
		return json(devlogEntries);
	} catch (error) {
		console.error('Error fetching devlog entries:', error);
		return json({ error: 'Failed to fetch devlog entries' }, { status: 500 });
	}
};

function getCategoryFromNumber(categoryNum: number): 'feature' | 'bugfix' | 'learning' | 'update' {
	switch (categoryNum) {
		case 1: return 'feature';
		case 2: return 'bugfix';
		case 3: return 'learning';
		default: return 'update';
	}
} 