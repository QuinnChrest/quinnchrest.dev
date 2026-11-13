<script lang="ts">
	import { onMount } from 'svelte';
	import { GITHUB_USER, summarize } from '$lib/github';
	import type { GitHubStats } from '$lib/types';

	// `initial` comes from the build, so real numbers are in the HTML right away.
	// The browser then refreshes them, at most once an hour per visitor: the
	// unauthenticated GitHub API allows 60 requests an hour per IP.
	let {
		initial,
		projects,
		entries
	}: { initial: GitHubStats | null; projects: number; entries: number } = $props();

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

	// A fixed-shape "elevation profile" for decoration under the numbers.
	const profile = 'M0 60 L30 52 L60 55 L90 40 L120 44 L150 30 L180 34 L210 18 L240 26 L270 14 L300 22 L330 8 L360 16 L400 6';
</script>

<div class="elev">
	<div><span class="mono">Public repos</span><b>{shown?.publicRepos ?? '—'}</b></div>
	<div><span class="mono">GitHub stars</span><b>{shown?.stars ?? '—'}</b></div>
	<div><span class="mono">Projects</span><b>{projects}</b></div>
	<div><span class="mono">Log entries</span><b>{entries}</b></div>
	<svg viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
		<path d="{profile} L400 70 L0 70Z" class="fill" />
		<path d={profile} class="line" />
	</svg>
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
	svg {
		grid-column: 1 / -1;
		width: 100%;
		height: 70px;
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
