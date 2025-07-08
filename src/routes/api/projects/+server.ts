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

function getStatusFromNumber(statusNum: number): 'completed' | 'in-progress' | 'planned' {
	switch (statusNum) {
		case 1: return 'planned';
		case 2: return 'in-progress';
		case 3: return 'completed';
		default: return 'planned';
	}
} 