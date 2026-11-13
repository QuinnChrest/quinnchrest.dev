<script lang="ts">
	import type { Snippet } from 'svelte';
	import Trail from '$lib/components/Trail.svelte';
	import { categoryLabel, noteToTrail } from '$lib/format';
	import type { Note, NoteCategory } from '$lib/types';

	// A list of notes grouped by year with category filters. Used by /notes and /changelog.
	let {
		notes,
		projectTitles = {},
		kicker,
		title,
		intro
	}: {
		notes: Note[];
		/** project slug → title, shown on each note; leave empty for the changelog */
		projectTitles?: Record<string, string>;
		kicker: string;
		title: string;
		intro: Snippet;
	} = $props();

	let category = $state<NoteCategory | 'all'>('all');

	const categories = $derived(
		(Object.keys(categoryLabel) as NoteCategory[]).filter((c) => notes.some((n) => n.category === c))
	);

	const years = $derived.by(() => {
		const groups = new Map<string, Note[]>();
		for (const n of notes) {
			if (category !== 'all' && n.category !== category) continue;
			const y = n.date.slice(0, 4);
			groups.set(y, [...(groups.get(y) ?? []), n]);
		}
		return [...groups.entries()];
	});
</script>

<div class="wrap">
	<header class="head">
		<span class="mono">{kicker}</span>
		<h1>{title}</h1>
		<p>{@render intro()}</p>
	</header>

	{#if categories.length > 1}
		<div class="filters" role="group" aria-label="Filter by category">
			<button aria-pressed={category === 'all'} onclick={() => (category = 'all')}>All</button>
			{#each categories as c}
				<button aria-pressed={category === c} onclick={() => (category = category === c ? 'all' : c)}>{categoryLabel[c]}</button>
			{/each}
		</div>
	{/if}

	{#each years as [year, list] (year)}
		<section aria-labelledby="y{year}">
			<h2 class="year" id="y{year}">{year}</h2>
			<Trail items={list.map((n) => noteToTrail(n, n.project ? projectTitles[n.project] : undefined))} />
		</section>
	{:else}
		<p class="empty">Nothing here yet.</p>
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
	.head :global(a) {
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
	.empty {
		color: var(--muted);
		margin-top: 32px;
	}
	@media (max-width: 600px) {
		.head {
			padding-top: 40px;
		}
	}
</style>
