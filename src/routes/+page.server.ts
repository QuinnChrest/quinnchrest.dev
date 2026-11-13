import { getDevLog, getProjects } from '$lib/server/content';
import { getGitHubStats } from '$lib/server/github';
import { getRecentPhotos } from '$lib/server/photos';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const projects = getProjects();
	const devlog = getDevLog();
	const [github, photos] = await Promise.all([getGitHubStats(fetch), getRecentPhotos(fetch)]);
	return {
		featured: projects.filter((p) => p.featured),
		others: projects.filter((p) => !p.featured),
		projectCount: projects.length,
		latest: devlog.slice(0, 4),
		entryCount: devlog.length,
		github,
		photos
	};
};
