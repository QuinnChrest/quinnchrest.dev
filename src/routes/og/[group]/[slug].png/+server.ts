import { error } from '@sveltejs/kit';
import { getAllPublishedNotes, getProject } from '$lib/server/content';
import { renderOgImage } from '$lib/server/og';
import { formatDate } from '$lib/format';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

// One share image per note: /og/<project-slug>/<note-slug>.png, or
// /og/changelog/<note-slug>.png for notes about the site.
export const entries: EntryGenerator = () =>
	getAllPublishedNotes().map((n) => ({ group: n.project ?? 'changelog', slug: n.slug }));

export const GET: RequestHandler = async ({ params }) => {
	const note = getAllPublishedNotes().find((n) => (n.project ?? 'changelog') === params.group && n.slug === params.slug);
	if (!note) error(404, 'Note not found');
	const where = note.project ? getProject(note.project)?.title : 'Changelog';
	const png = await renderOgImage({
		kicker: `${where} · ${formatDate(note.date, 'short')}`,
		title: note.title,
		key: note.url
	});
	return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
