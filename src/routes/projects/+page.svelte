<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Trailhead from '$lib/components/Trailhead.svelte';
	import { statusLabel } from '$lib/format';
	import type { ProjectStatus } from '$lib/types';

	let { data } = $props();

	let status = $state<ProjectStatus | 'all'>('all');
	let tech = $state<string | null>(null);

	// Tech names are normalized for filtering so "Typescript" and "TypeScript" match.
	const key = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');

	const techs = $derived.by(() => {
		const seen = new Map<string, { name: string; count: number }>();
		for (const p of data.projects)
			for (const t of p.technologies) {
				const k = key(t);
				const cur = seen.get(k);
				seen.set(k, { name: cur?.name ?? t, count: (cur?.count ?? 0) + 1 });
			}
		return [...seen.entries()].filter(([, v]) => v.count > 1).sort((a, b) => b[1].count - a[1].count);
	});

	const statuses = $derived(
		(['in-progress', 'completed', 'planned'] as const).filter((s) => data.projects.some((p) => p.status === s))
	);

	const shown = $derived(
		data.projects.filter(
			(p) => (status === 'all' || p.status === status) && (!tech || p.technologies.some((t) => key(t) === tech))
		)
	);
</script>

<Seo
	title="Projects | Quinn Chrest"
	description="Side projects by Quinn Chrest: a Claude-powered voice assistant, a heat map of bike rides, a photo gallery, daily guessing games and more."
/>

<div class="wrap">
	<header class="head">
		<span class="mono">Trail map</span>
		<h1>Projects</h1>
		<p>Everything I've built on evenings and weekends, newest first. Pick one for the details and any dev log entries about it.</p>
	</header>

	<div class="filters" role="group" aria-label="Filter projects">
		<button aria-pressed={status === 'all' && !tech} onclick={() => ((status = 'all'), (tech = null))}>All</button>
		{#each statuses as s}
			<button aria-pressed={status === s} onclick={() => (status = status === s ? 'all' : s)}>{statusLabel[s]}</button>
		{/each}
		<span class="sep" aria-hidden="true"></span>
		{#each techs as [k, t]}
			<button aria-pressed={tech === k} onclick={() => (tech = tech === k ? null : k)}>{t.name}</button>
		{/each}
	</div>

	<p class="mono count" aria-live="polite">{shown.length} of {data.projects.length} projects</p>

	<div class="grid">
		{#each shown as project, i (project.slug)}
			<div class="cell">
				<Trailhead {project} eager={i < 3} />
				{#if data.entryCounts[project.slug]}
					<span class="mono tag">{data.entryCounts[project.slug]} log {data.entryCounts[project.slug] === 1 ? 'entry' : 'entries'}</span>
				{/if}
			</div>
		{/each}
	</div>
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
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
		margin-top: 12px;
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
	.sep {
		width: 1px;
		height: 20px;
		background: var(--line);
		margin: 0 4px;
	}
	.count {
		margin: 18px 0;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	.cell {
		position: relative;
		display: flex;
		flex-direction: column;
	}
	.cell > :global(.card) {
		flex: 1;
	}
	.tag {
		position: absolute;
		top: 12px;
		right: 12px;
		background: var(--bg-raised);
		color: var(--ink);
		padding: 3px 8px;
		border-radius: 6px;
		font-size: 11px;
		pointer-events: none;
	}
	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 600px) {
		.grid {
			grid-template-columns: 1fr;
		}
		.head {
			padding-top: 40px;
		}
	}
</style>
