<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Trail from '$lib/components/Trail.svelte';
	import { categoryLabel } from '$lib/format';
	import type { DevLogCategory } from '$lib/types';

	let { data } = $props();

	let category = $state<DevLogCategory | 'all'>('all');

	const categories = $derived(
		(Object.keys(categoryLabel) as DevLogCategory[]).filter((c) => data.entries.some((e) => e.category === c))
	);

	// Group by year, newest first.
	const years = $derived.by(() => {
		const groups = new Map<string, typeof data.entries>();
		for (const e of data.entries) {
			if (category !== 'all' && e.category !== category) continue;
			const y = e.date.slice(0, 4);
			groups.set(y, [...(groups.get(y) ?? []), e]);
		}
		return [...groups.entries()];
	});
</script>

<Seo
	title="Dev log | Quinn Chrest"
	description="Notes from building side projects: new sites, a voice assistant powered by Claude, moving to GitHub Pages, and what went wrong along the way."
/>

<div class="wrap">
	<header class="head">
		<span class="mono">Trail log</span>
		<h1>Dev log</h1>
		<p>Notes from building things: what I made, how it works and what broke along the way. Also available as an <a href="/api/feed.xml">RSS feed</a>.</p>
	</header>

	<div class="filters" role="group" aria-label="Filter by category">
		<button aria-pressed={category === 'all'} onclick={() => (category = 'all')}>All</button>
		{#each categories as c}
			<button aria-pressed={category === c} onclick={() => (category = category === c ? 'all' : c)}>{categoryLabel[c]}</button>
		{/each}
	</div>

	{#each years as [year, entries] (year)}
		<section aria-labelledby="y{year}">
			<h2 class="year" id="y{year}">{year}</h2>
			<Trail {entries} />
		</section>
	{/each}
</div>

<style>
	.head {
		padding: 64px 0 24px;
		max-width: 680px;
	}
	h1 {
		font-size: clamp(40px, 6vw, 64px);
		font-weight: 800;
		margin: 10px 0 12px;
	}
	.head p {
		color: var(--muted);
		font-size: 18px;
		margin: 0;
	}
	.head a {
		color: var(--trail);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 12px 0 8px;
	}
	.filters button {
		font: inherit;
		font-size: 14px;
		padding: 5px 14px;
		border-radius: 99px;
		border: 1px solid var(--line);
		background: var(--bg-raised);
		color: var(--ink);
		cursor: pointer;
	}
	.filters button:hover {
		border-color: var(--trail);
	}
	.filters button[aria-pressed='true'] {
		background: var(--ink);
		color: var(--bg);
		border-color: var(--ink);
	}
	.year {
		font-size: 28px;
		font-weight: 800;
		margin: 48px 0 20px;
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.year::after {
		content: '';
		flex: 1;
		border-top: 1px solid var(--line);
	}
	@media (max-width: 600px) {
		.head {
			padding-top: 40px;
		}
	}
</style>
