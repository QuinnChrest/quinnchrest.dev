import { getProjects } from '$lib/server/content';
import { latestNotes } from '$lib/server/latest';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ projects: getProjects(), latest: latestNotes() });
