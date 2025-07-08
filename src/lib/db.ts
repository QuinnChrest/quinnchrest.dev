import { Pool } from 'pg';
import { env } from '$env/dynamic/private';

// Database connection configuration using environment variables
const pool = new Pool({
	host: env.DB_HOST,
	port: parseInt(env.DB_PORT),
	database: env.DB_NAME,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	ssl: env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.on('connect', () => {
	console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});

export default pool; 