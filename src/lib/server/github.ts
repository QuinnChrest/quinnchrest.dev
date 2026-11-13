import { GITHUB_USER, summarize } from '$lib/github';
import type { Contributions, GitHubStats } from '$lib/types';

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

let contributionsCache: Promise<Contributions | null> | undefined;

/**
 * Every contribution since the account's first, summed by month, fetched at
 * build time (the daily deploy keeps it current). Uses the GraphQL API when
 * there's a token (as in GitHub Actions); otherwise reads the public
 * contributions pages, which need no token. Returns null if neither works, and
 * the chart is left out.
 */
export function getContributions(fetchFn: typeof fetch = fetch): Promise<Contributions | null> {
	contributionsCache ??= loadContributions(fetchFn);
	return contributionsCache;
}

type Day = { date: string; count: number };

async function loadContributions(fetchFn: typeof fetch): Promise<Contributions | null> {
	const token = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.GITHUB_TOKEN;
	let days: Day[] | null = null;
	if (token) days = await fromGraphQL(fetchFn, token).catch(() => null);
	if (!days) days = await fromPages(fetchFn).catch((e) => (console.warn(`Skipping contributions chart: ${e}`), null));
	return days ? byMonth(days) : null;
}

async function fromGraphQL(fetchFn: typeof fetch, token: string): Promise<Day[] | null> {
	const gql = async (query: string) => {
		const res = await fetchFn('https://api.github.com/graphql', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ query })
		});
		if (!res.ok) throw new Error(`GraphQL ${res.status}`);
		return (await res.json())?.data?.user?.contributionsCollection;
	};
	const years: number[] = (await gql(`{ user(login: "${GITHUB_USER}") { contributionsCollection { contributionYears } } }`))
		?.contributionYears;
	if (!years?.length) return null;
	const all = await Promise.all(
		years.map((y) =>
			gql(`{ user(login: "${GITHUB_USER}") { contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") {
				contributionCalendar { weeks { contributionDays { date contributionCount } } } } } }`)
		)
	);
	return all.flatMap((c) =>
		c.contributionCalendar.weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number }[] }) =>
			w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
		)
	);
}

/** Public calendar pages, one per year back to the account's creation. */
async function fromPages(fetchFn: typeof fetch): Promise<Day[] | null> {
	const profile = await fetchFn(`https://api.github.com/users/${GITHUB_USER}`);
	const first = profile.ok ? new Date((await profile.json()).created_at).getUTCFullYear() : new Date().getUTCFullYear() - 4;
	const now = new Date().getUTCFullYear();
	const years = Array.from({ length: now - first + 1 }, (_, i) => first + i);
	const pages = await Promise.all(
		years.map(async (y) => {
			const res = await fetchFn(`https://github.com/users/${GITHUB_USER}/contributions?from=${y}-01-01&to=${y}-12-31`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return parseContributionsPage(await res.text());
		})
	);
	return pages.flat();
}

/** Reads day cells (date + id) and their tooltips ("5 contributions on …") from calendar HTML. */
export function parseContributionsPage(html: string): Day[] {
	const dates = new Map<string, string>();
	for (const [tag] of html.matchAll(/<td[^>]*data-date="[^"]+"[^>]*>/g)) {
		const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
		const id = tag.match(/\bid="([^"]+)"/)?.[1];
		if (date && id) dates.set(id, date);
	}
	const days: Day[] = [];
	for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>\s*(No|\d+) contributions? on/g)) {
		const date = dates.get(m[1]);
		if (date) days.push({ date, count: m[2] === 'No' ? 0 : Number(m[2]) });
	}
	return days;
}

function byMonth(days: Day[]): Contributions | null {
	const months = new Map<string, number>();
	const today = new Date().toISOString().slice(0, 10);
	for (const d of days) {
		if (d.date > today) continue;
		const m = d.date.slice(0, 7);
		months.set(m, (months.get(m) ?? 0) + d.count);
	}
	const sorted = [...months.entries()].sort(([a], [b]) => a.localeCompare(b));
	// Start at the first month with real activity (3+), so a stray early commit
	// doesn't add years of flat line.
	const start = sorted.findIndex(([, c]) => c >= 3);
	if (start < 0) return null;
	const list = sorted.slice(start).map(([month, count]) => ({ month, count }));
	return { total: list.reduce((s, m) => s + m.count, 0), months: list };
}
