import { getNotes, getProjects } from '$lib/server/content';
import { getBlogPosts } from '$lib/server/blog';
import { getGitHubStats } from '$lib/server/github';
import { latestNotes } from '$lib/server/latest';
import { getRecentPhotos } from '$lib/server/photos';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const projects = getProjects();
	const [github, photos, blog] = await Promise.all([getGitHubStats(fetch), getRecentPhotos(fetch), getBlogPosts(fetch)]);
	return {
		featured: projects.filter((p) => p.featured),
		others: projects.filter((p) => !p.featured),
		projectCount: projects.length,
		noteCount: getNotes().length,
		latest: latestNotes(),
		github,
		photos,
		blog
	};
};
