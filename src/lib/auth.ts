import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export function requireAuth(request: Request): boolean {
	// Get the Authorization header
	const authHeader = request.headers.get('Authorization');
	
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return false;
	}
	
	// Extract the token (in this case, we'll use a simple approach with admin credentials)
	const token = authHeader.substring(7);
	
	// For now, we'll use a simple token based on admin credentials
	// In a production environment, you'd want to use proper JWT tokens
	const adminUsername = env.ADMIN_USERNAME;
	const adminPassword = env.ADMIN_PASSWORD;
	
	if (!adminUsername || !adminPassword) {
		return false;
	}

	const decoded = atob(token);
	const [username, password, timestamp] = decoded.split(':');

	// Check if token is expired
	const tokenTime = parseInt(timestamp);
	const now = Date.now();
	const maxAge = 60 * 60 * 1000;
	
	if (now - tokenTime > maxAge) {
		return false;
	}
	
	return username === adminUsername && password === adminPassword;
}

export function authGuard(request: Request) {
	if (!requireAuth(request)) {
		throw new Error('Unauthorized');
	}
} 