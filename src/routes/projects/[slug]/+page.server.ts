import { error } from '@sveltejs/kit';
import { getNotesForProject, getProject, getProjects } from '$lib/server/content';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => getProjects().map((p) => ({ slug: p.slug }));

export const load: PageServerLoad = ({ params }) => {
	const project = getProject(params.slug);
	if (!project) error(404, 'Project not found');
	return { project, notes: getNotesForProject(project.slug) };
};
