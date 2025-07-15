import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import pool from '$lib/db';
import { authGuard } from '$lib/auth';

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		// Check authentication
		authGuard(request);
		
		const { id } = params;
		const { title, content, category, tags, date } = await request.json();
		
		const client = await pool.connect();
		
		const query = `
			UPDATE devlog 
			SET title = $1, content = $2, category = $3, tags = $4, date = $5
			WHERE id = $6
			RETURNING id
		`;
		
		const values = [
			title,
			content,
			getCategoryNumber(category),
			tags.join(', '),
			date,
			id
		];
		
		const result = await client.query(query, values);
		client.release();
		
		if (result.rowCount === 0) {
			return json({ error: 'Dev log entry not found' }, { status: 404 });
		}
		
		return json({ success: true });
	} catch (error) {
		if (error instanceof Error && error.message === 'Unauthorized') {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error updating dev log entry:', error);
		return json({ error: 'Failed to update dev log entry' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
		// Check authentication
		authGuard(request);
		
		const { id } = params;
		
		const client = await pool.connect();
		
		const query = 'DELETE FROM devlog WHERE id = $1';
		const result = await client.query(query, [id]);
		client.release();
		
		if (result.rowCount === 0) {
			return json({ error: 'Dev log entry not found' }, { status: 404 });
		}
		
		return json({ success: true });
	} catch (error) {
		if (error instanceof Error && error.message === 'Unauthorized') {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error deleting dev log entry:', error);
		return json({ error: 'Failed to delete dev log entry' }, { status: 500 });
	}
};

function getCategoryNumber(category: string): number {
	switch (category) {
		case 'feature': return 1;
		case 'bug-fix': return 2;
		case 'learning': return 3;
		case 'update': return 4;
		default: return 1;
	}
} 