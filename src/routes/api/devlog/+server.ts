import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import pool from '$lib/db';
import { authGuard } from '$lib/auth';

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

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Check authentication
		authGuard(request);
		
		const { title, content, category, tags, date } = await request.json();
		
		const client = await pool.connect();
		
		const query = `
			INSERT INTO devlog (title, content, category, tags, date)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id
		`;
		
		const values = [
			title,
			content,
			getCategoryNumber(category),
			tags.join(', '),
			date
		];
		
		const result = await client.query(query, values);
		client.release();
		
		return json({ id: result.rows[0].id, success: true });
	} catch (error) {
		if (error instanceof Error && error.message === 'Unauthorized') {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error creating devlog entry:', error);
		return json({ error: 'Failed to create devlog entry' }, { status: 500 });
	}
};

function getCategoryFromNumber(categoryNum: number): 'feature' | 'bug-fix' | 'learning' | 'update' {
	switch (categoryNum) {
		case 1: return 'feature';
		case 2: return 'bug-fix';
		case 3: return 'learning';
		case 4: return 'update';
		default: return 'feature';
	}
}

function getCategoryNumber(category: string): number {
	switch (category) {
		case 'feature': return 1;
		case 'bug-fix': return 2;
		case 'learning': return 3;
		case 'update': return 4;
		default: return 1;
	}
} 