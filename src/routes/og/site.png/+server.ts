import { renderOgImage } from '$lib/server/og';
import type { RequestHandler } from './$types';

export const prerender = true;

// Share image for pages without their own (home, project list, dev log list).
export const GET: RequestHandler = async () => {
	const png = await renderOgImage({
		kicker: 'Software developer · Chanhassen, MN',
		title: 'Building side projects one mile at a time.',
		key: 'site'
	});
	return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
