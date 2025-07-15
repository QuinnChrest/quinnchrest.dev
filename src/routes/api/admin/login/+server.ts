import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { checkRateLimit, recordFailedAttempt } from '$lib/rateLimiter';

export async function POST({ request }) {
	try {
		// Get client IP for rate limiting
		const clientIP = request.headers.get('x-forwarded-for') || 
						request.headers.get('x-real-ip') || 
						'unknown';
		
		// Check rate limit
		const rateLimit = checkRateLimit(clientIP);
		if (!rateLimit.allowed) {
			const minutes = Math.floor(rateLimit.remainingTime! / 60);
			const seconds = rateLimit.remainingTime! % 60;
			return json({ 
				error: `Too many login attempts. Please try again in ${minutes}m ${seconds}s` 
			}, { status: 429 });
		}
		
		const { username, password } = await request.json();
		
		// Check credentials against environment variables
		const adminUsername = env.ADMIN_USERNAME;
		const adminPassword = env.ADMIN_PASSWORD;
		
		if (!adminUsername || !adminPassword) {
			return json({ error: 'Admin credentials not configured' }, { status: 500 });
		}
		
		if (username === adminUsername && password === adminPassword) {
			// Create a simple token (in production, use proper JWT)
			const token = btoa(`${username}:${password}:${Date.now()}`);
			return json({ success: true, token });
		} else {
			// Record failed attempt
			recordFailedAttempt(clientIP);
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}
	} catch (error) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
}