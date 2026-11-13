import { getDevLog, getProjects } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const counts: Record<string, number> = {};
	for (const e of getDevLog()) if (e.project) counts[e.project] = (counts[e.project] ?? 0) + 1;
	return { projects: getProjects(), entryCounts: counts };
};
