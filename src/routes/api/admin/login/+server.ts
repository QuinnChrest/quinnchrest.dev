import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const { username, password } = await request.json();
		
		// Check credentials against environment variables
		const adminUsername = env.ADMIN_USERNAME;
		const adminPassword = env.ADMIN_PASSWORD;
		
		if (!adminUsername || !adminPassword) {
			return json({ error: 'Admin credentials not configured' }, { status: 500 });
		}
		
		if (username === adminUsername && password === adminPassword) {
			// Create a simple token (in production, use proper JWT)
			const token = btoa(`${username}:${password}`);
			return json({ success: true, token });
		} else {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}
	} catch (error) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
} 