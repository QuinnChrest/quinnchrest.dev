import { error } from '@sveltejs/kit';
import { getChangelog } from '$lib/server/content';
import { pager } from '$lib/server/pager';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => getChangelog().map((n) => ({ slug: n.slug }));

export const load: PageServerLoad = ({ params }) => {
	const notes = getChangelog();
	const note = notes.find((n) => n.slug === params.slug);
	if (!note) error(404, 'Changelog note not found');
	return { note, ...pager(notes, note) };
};
