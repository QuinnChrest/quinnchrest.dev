import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import pool from '$lib/db';
import { authGuard } from '$lib/auth';

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		// Check authentication
		authGuard(request);
		
		const { id } = params;
		const { title, description, image, technologies, githubUrl, liveUrl, status, featured } = await request.json();
		
		const client = await pool.connect();
		
		const query = `
			UPDATE projects 
			SET title = $1, description = $2, thumbnail = $3, tags = $4, repo = $5, demo = $6, status = $7, featured = $8
			WHERE id = $9
			RETURNING id
		`;
		
		const values = [
			title,
			description,
			image,
			technologies.join(', '),
			githubUrl || null,
			liveUrl || null,
			getStatusNumber(status),
			featured,
			id
		];
		
		const result = await client.query(query, values);
		client.release();
		
		if (result.rowCount === 0) {
			return json({ error: 'Project not found' }, { status: 404 });
		}
		
		return json({ success: true });
	} catch (error) {
		if (error instanceof Error && error.message === 'Unauthorized') {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error updating project:', error);
		return json({ error: 'Failed to update project' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
		// Check authentication
		authGuard(request);
		
		const { id } = params;
		
		const client = await pool.connect();
		
		const query = 'DELETE FROM projects WHERE id = $1';
		const result = await client.query(query, [id]);
		client.release();
		
		if (result.rowCount === 0) {
			return json({ error: 'Project not found' }, { status: 404 });
		}
		
		return json({ success: true });
	} catch (error) {
		if (error instanceof Error && error.message === 'Unauthorized') {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error deleting project:', error);
		return json({ error: 'Failed to delete project' }, { status: 500 });
	}
};

function getStatusNumber(status: string): number {
	switch (status) {
		case 'planned': return 1;
		case 'in-progress': return 2;
		case 'completed': return 3;
		default: return 1;
	}
} 