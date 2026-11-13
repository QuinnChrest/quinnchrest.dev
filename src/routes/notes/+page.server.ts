import { getNotes, getProjects } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	notes: getNotes(),
	projectTitles: Object.fromEntries(getProjects().map((p) => [p.slug, p.title]))
});
