import { error } from '@sveltejs/kit';
import { getDevLog, getProject } from '$lib/server/content';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => getDevLog().map((e) => ({ slug: e.slug }));

export const load: PageServerLoad = ({ params }) => {
	const all = getDevLog();
	const i = all.findIndex((e) => e.slug === params.slug);
	if (i === -1) error(404, 'Entry not found');
	const entry = all[i];
	const project = entry.project ? getProject(entry.project) : undefined;
	const pick = (e?: (typeof all)[number]) => (e ? { slug: e.slug, title: e.title } : null);
	return {
		entry,
		project: project ? { slug: project.slug, title: project.title, image: project.image } : null,
		// The list is newest first, so the next (newer) entry is one index up.
		newer: pick(all[i - 1]),
		older: pick(all[i + 1])
	};
};
