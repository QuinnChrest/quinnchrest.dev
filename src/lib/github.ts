import type { GitHubStats } from '$lib/types';

export const GITHUB_USER = 'QuinnChrest';

// Turns the raw GitHub API responses into the numbers the site shows.
// Used at build time (src/lib/server/github.ts) and in the browser (Stats.svelte).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function summarize(profile: any, repos: any[]): GitHubStats {
	return {
		publicRepos: profile.public_repos,
		followers: profile.followers,
		stars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
		forks: repos.reduce((sum, r) => sum + r.forks_count, 0),
		topRepos: [...repos]
			.filter((r) => !r.fork)
			.sort((a, b) => b.stargazers_count - a.stargazers_count || b.pushed_at.localeCompare(a.pushed_at))
			.slice(0, 5)
			.map((r) => ({ name: r.name, url: r.html_url, description: r.description, stars: r.stargazers_count, forks: r.forks_count }))
	};
}
