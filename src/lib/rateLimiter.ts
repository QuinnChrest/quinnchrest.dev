// Simple in-memory rate limiter for login attempts
interface LoginAttempt {
	count: number;
	lastAttempt: number;
	blockedUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

// Clean up old entries every 5 minutes
setInterval(() => {
	const now = Date.now();
	const maxAge = 15 * 60 * 1000; // 15 minutes
	
	for (const [key, attempt] of loginAttempts.entries()) {
		if (now - attempt.lastAttempt > maxAge) {
			loginAttempts.delete(key);
		}
	}
}, 5 * 60 * 1000); // Run every 5 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
	const now = Date.now();
	const attempt = loginAttempts.get(identifier);
	
	// If no previous attempts, allow
	if (!attempt) {
		loginAttempts.set(identifier, { count: 0, lastAttempt: now });
		return { allowed: true };
	}
	
	// Check if currently blocked
	if (attempt.blockedUntil && now < attempt.blockedUntil) {
		return { 
			allowed: false, 
			remainingTime: Math.ceil((attempt.blockedUntil - now) / 1000) 
		};
	}
	
	// Reset if enough time has passed (15 minutes)
	if (now - attempt.lastAttempt > 15 * 60 * 1000) {
		loginAttempts.set(identifier, { count: 0, lastAttempt: now });
		return { allowed: true };
	}
	
	// Check if too many attempts
	if (attempt.count >= 5) {
		// Block for 15 minutes
		const blockedUntil = now + (15 * 60 * 1000);
		attempt.blockedUntil = blockedUntil;
		loginAttempts.set(identifier, attempt);
		
		return { 
			allowed: false, 
			remainingTime: 15 * 60 
		};
	}
	
	// Increment attempt count
	attempt.count++;
	attempt.lastAttempt = now;
	loginAttempts.set(identifier, attempt);
	
	return { allowed: true };
}

export function recordFailedAttempt(identifier: string): void {
	const now = Date.now();
	const attempt = loginAttempts.get(identifier);
	
	if (attempt) {
		attempt.count++;
		attempt.lastAttempt = now;
	} else {
		loginAttempts.set(identifier, { count: 1, lastAttempt: now });
	}
}