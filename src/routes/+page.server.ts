import { getDevLog, getProjects } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		projects: getProjects(),
		devlog: getDevLog()
	};
};
