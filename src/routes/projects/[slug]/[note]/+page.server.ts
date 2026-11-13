import { error } from '@sveltejs/kit';
import { getNotes, getNotesForProject, getProject } from '$lib/server/content';
import { pager } from '$lib/server/pager';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => getNotes().map((n) => ({ slug: n.project!, note: n.slug }));

export const load: PageServerLoad = ({ params }) => {
	const project = getProject(params.slug);
	const notes = getNotesForProject(params.slug);
	const note = notes.find((n) => n.slug === params.note);
	if (!project || !note) error(404, 'Note not found');
	return {
		note,
		project: { slug: project.slug, title: project.title, image: project.image },
		// Older/newer stay within the project's own notes.
		...pager(notes, note)
	};
};
