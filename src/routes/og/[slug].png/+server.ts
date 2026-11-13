import { error } from '@sveltejs/kit';
import { getDevLog, getEntry } from '$lib/server/content';
import { renderOgImage } from '$lib/server/og';
import { categoryLabel, formatDate } from '$lib/format';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

// One share image per dev log entry: /og/<entry-slug>.png
export const entries: EntryGenerator = () => getDevLog().map((e) => ({ slug: e.slug }));

export const GET: RequestHandler = async ({ params }) => {
	const entry = getEntry(params.slug);
	if (!entry) error(404, 'Entry not found');
	const png = await renderOgImage({
		kicker: `Dev log · ${formatDate(entry.date, 'short')} · ${categoryLabel[entry.category]}`,
		title: entry.title,
		key: entry.slug
	});
	return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
