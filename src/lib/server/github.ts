import { GITHUB_USER, summarize } from '$lib/github';
import type { GitHubStats } from '$lib/types';

let cached: Promise<GitHubStats | null> | undefined;

/**
 * GitHub numbers fetched once at build time, so the page has real values in its
 * HTML without waiting on the API. The Stats component refreshes them in the
 * browser afterwards. Returns null (and the build carries on) if GitHub can't be
 * reached. In GitHub Actions, GITHUB_TOKEN raises the rate limit.
 */
export function getGitHubStats(fetchFn: typeof fetch = fetch): Promise<GitHubStats | null> {
	cached ??= load(fetchFn);
	return cached;
}

async function load(fetchFn: typeof fetch): Promise<GitHubStats | null> {
	const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
	// Read directly: prerendering can't use $env/dynamic, and $env/static would fail when unset.
	const token = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;
	try {
		const [profileRes, reposRes] = await Promise.all([
			fetchFn(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
			fetchFn(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, { headers })
		]);
		if (!profileRes.ok || !reposRes.ok) throw new Error(`GitHub API ${profileRes.status}/${reposRes.status}`);
		return summarize(await profileRes.json(), await reposRes.json());
	} catch (e) {
		console.warn(`Skipping build-time GitHub stats: ${e instanceof Error ? e.message : e}`);
		return null;
	}
}
