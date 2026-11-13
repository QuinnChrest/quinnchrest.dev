<script lang="ts">
	import { onMount } from 'svelte';
	import { GITHUB_USER, summarize } from '$lib/github';
	import type { Contributions, GitHubStats } from '$lib/types';

	// `initial` comes from the build, so real numbers are in the HTML right away.
	// The browser then refreshes them, at most once an hour per visitor: the
	// unauthenticated GitHub API allows 60 requests an hour per IP.
	let {
		initial,
		contributions,
		projects,
		notes
	}: { initial: GitHubStats | null; contributions: Contributions | null; projects: number; notes: number } = $props();

	let stats = $state<GitHubStats | null>(null);
	const shown = $derived(stats ?? initial);

	const CACHE_KEY = 'github-stats-v2';
	const CACHE_TTL_MS = 60 * 60 * 1000;

	onMount(async () => {
		try {
			const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
			if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
				stats = cached.stats;
				return;
			}
		} catch {
			// Storage unavailable; fall through to a fetch.
		}
		try {
			const [p, r] = await Promise.all([
				fetch(`https://api.github.com/users/${GITHUB_USER}`),
				fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
			]);
			if (!p.ok || !r.ok) return; // Keep the build-time numbers.
			stats = summarize(await p.json(), await r.json());
			try {
				localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), stats }));
			} catch {
				// Ignore.
			}
		} catch {
			// Offline or blocked; keep the build-time numbers.
		}
	});

	// The elevation profile: GitHub contributions per month, drawn as terrain.
	// Built from data fetched at build time (src/lib/server/github.ts).
	const W = 400, H = 70, TOP = 10, BOTTOM = 62;
	const monthName = (m: string, style: 'short' | 'long' = 'short') =>
		new Date(`${m}-01T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: style === 'long' ? 'long' : 'short', year: 'numeric' });

	const chart = $derived.by(() => {
		const months = contributions?.months ?? [];
		if (months.length < 2) return null;
		const max = Math.max(...months.map((m) => m.count), 1);
		const pts = months.map((m, i) => ({
			x: (i / (months.length - 1)) * W,
			y: BOTTOM - (m.count / max) * (BOTTOM - TOP)
		}));
		// Smooth curve through the points (Catmull-Rom as cubic Béziers), never dipping below the baseline.
		let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
		for (let i = 0; i < pts.length - 1; i++) {
			const [p0, p1, p2, p3] = [pts[Math.max(0, i - 1)], pts[i], pts[i + 1], pts[Math.min(pts.length - 1, i + 2)]];
			const c1y = Math.min(BOTTOM, p1.y + (p2.y - p0.y) / 6), c2y = Math.min(BOTTOM, p2.y - (p3.y - p1.y) / 6);
			d += `C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${c1y.toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
		}
		const peakIndex = months.findIndex((m) => m.count === max);
		const years = months
			.map((m, i) => ({ year: m.month.slice(0, 4), x: (i / (months.length - 1)) * 100, jan: m.month.endsWith('-01') }))
			.filter((m) => m.jan);
		return {
			line: d,
			fill: `${d}L${W} ${H}L0 ${H}Z`,
			peak: { ...pts[peakIndex], xPct: (pts[peakIndex].x / W) * 100, month: months[peakIndex].month, count: max },
			years,
			from: months[0].month,
			total: contributions!.total
		};
	});
</script>

<div class="elev">
	<div><span class="mono">Public repos</span><b>{shown?.publicRepos ?? '—'}</b></div>
	<div><span class="mono">GitHub stars</span><b>{shown?.stars ?? '—'}</b></div>
	<div><span class="mono">Projects</span><b>{projects}</b></div>
	<div><span class="mono">Project notes</span><b>{notes}</b></div>
	{#if chart}
		<figure class="profile">
			<figcaption class="mono">
				{chart.total} GitHub contributions since {monthName(chart.from)}, by month
			</figcaption>
			<div class="plot">
				<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" role="img" aria-label="Monthly GitHub contributions; busiest was {monthName(chart.peak.month, 'long')} with {chart.peak.count}">
					<path d={chart.fill} class="fill" />
					<path d={chart.line} class="line" />
				</svg>
				<span class="peak mono" style="left: {chart.peak.xPct}%">▲ {chart.peak.count} · {monthName(chart.peak.month)}</span>
				{#each chart.years as y}
					<span class="year mono" style="left: {y.x}%">{y.year}</span>
				{/each}
			</div>
		</figure>
	{/if}
</div>

{#if shown?.topRepos.length}
	<ul class="repos">
		{#each shown.topRepos as repo}
			<li>
				<a href={repo.url} target="_blank" rel="noopener">
					<b>{repo.name}</b>
					<span class="mono">★ {repo.stars} · ⑂ {repo.forks}</span>
					{#if repo.description}<p>{repo.description}</p>{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.elev {
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 22px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}
	b {
		display: block;
		font-size: 40px;
		font-weight: 800;
		line-height: 1.1;
	}
	.profile {
		grid-column: 1 / -1;
		margin: 6px 0 0;
	}
	.profile figcaption {
		margin-bottom: 18px;
	}
	.plot {
		position: relative;
		padding-bottom: 20px;
	}
	svg {
		display: block;
		width: 100%;
		height: 90px;
	}
	.peak {
		position: absolute;
		top: -16px;
		transform: translateX(-100%);
		white-space: nowrap;
		color: var(--trail);
		font-size: 11px;
	}
	.year {
		position: absolute;
		bottom: 0;
		font-size: 11px;
		border-left: 1px solid var(--line);
		padding-left: 6px;
	}
	.fill {
		fill: var(--trail);
		opacity: 0.15;
	}
	.line {
		fill: none;
		stroke: var(--trail);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}
	.repos {
		list-style: none;
		padding: 0;
		margin: 20px 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 12px;
	}
	.repos a {
		display: block;
		height: 100%;
		padding: 14px 16px;
		border: 1px dashed var(--line);
		border-radius: 12px;
	}
	.repos a:hover {
		border-color: var(--trail);
	}
	.repos a:hover b {
		color: var(--trail);
	}
	.repos b {
		font-size: 17px;
		display: inline;
		margin-right: 8px;
	}
	.repos p {
		margin: 4px 0 0;
		color: var(--muted);
		font-size: 14px;
	}
	@media (max-width: 800px) {
		.elev {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
