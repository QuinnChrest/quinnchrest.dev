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
	
	// Create a simple token (in production, use proper JWT)
	const expectedToken = btoa(`${adminUsername}:${adminPassword}`);
	
	return token === expectedToken;
}

export function authGuard(request: Request) {
	if (!requireAuth(request)) {
		throw new Error('Unauthorized');
	}
} 