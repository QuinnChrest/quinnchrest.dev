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
				status,
				featured,
				thumbnail,
				tags,
				repo,
				demo,
				description
			FROM projects 
			ORDER BY featured DESC, id DESC
		`;
		
		const result = await client.query(query);
		client.release();
		
		// Transform the data to match the expected format
		const projects = result.rows.map((row: any) => ({
			id: row.id.toString(),
			title: row.title,
			description: row.description,
			image: row.thumbnail || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
			technologies: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
			githubUrl: row.repo || undefined,
			liveUrl: row.demo || undefined,
			status: getStatusFromNumber(row.status),
			featured: row.featured
		}));
		
		return json(projects);
	} catch (error) {
		console.error('Error fetching projects:', error);
		return json({ error: 'Failed to fetch projects' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Check authentication
		authGuard(request);
		
		const { title, description, image, technologies, githubUrl, liveUrl, status, featured } = await request.json();
		
		const client = await pool.connect();
		
		const query = `
			INSERT INTO projects (title, description, thumbnail, tags, repo, demo, status, featured)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
			featured
		];
		
		const result = await client.query(query, values);
		client.release();
		
		return json({ id: result.rows[0].id, success: true });
	} catch (error) {
		if (error instanceof Error && error.message === 'Unauthorized') {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		console.error('Error creating project:', error);
		return json({ error: 'Failed to create project' }, { status: 500 });
	}
};

function getStatusFromNumber(statusNum: number): 'completed' | 'in-progress' | 'planned' {
	switch (statusNum) {
		case 1: return 'planned';
		case 2: return 'in-progress';
		case 3: return 'completed';
		default: return 'planned';
	}
}

function getStatusNumber(status: string): number {
	switch (status) {
		case 'planned': return 1;
		case 'in-progress': return 2;
		case 'completed': return 3;
		default: return 1;
	}
} 