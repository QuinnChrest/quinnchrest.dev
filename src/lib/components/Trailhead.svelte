<script lang="ts">
	import type { Project } from '$lib/types';
	import { formatDate, kindLabel, statusLabel } from '$lib/format';

	let {
		project,
		eager = false,
		latest
	}: {
		project: Project;
		eager?: boolean;
		/** The project's newest note, if it has any */
		latest?: { title: string; date: string; count: number };
	} = $props();
	const wip = $derived(project.status !== 'completed');
</script>

<a class="card" href="/projects/{project.slug}">
	<div class="media">
		<img
			src={project.image}
			alt=""
			loading={eager ? 'eager' : 'lazy'}
			width="600"
			height="400"
			style="view-transition-name: project-{project.slug}"
		/>
		{#if project.kind}<span class="kind kind-{project.kind}">{kindLabel[project.kind]}</span>{/if}
	</div>
	<div>
		<span class="mono marker" class:wip>
			{wip ? statusLabel[project.status] + ' · ' : ''}{project.technologies.slice(0, 2).join(' · ')}
		</span>
		<h3>{project.title}</h3>
		<p>{project.description}</p>
		{#if latest}
			<span class="latest">
				<span class="mono">Latest note · {formatDate(latest.date, 'short')}{latest.count > 1 ? ` · ${latest.count} notes` : ''}</span>
				{latest.title}
			</span>
		{/if}
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
		transition:
			transform 0.15s,
			box-shadow 0.15s;
	}
	.card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow);
	}
	.card:hover h3 {
		color: var(--trail);
	}
	img {
		width: 100%;
		height: auto;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		display: block;
		background: var(--line);
	}
	.card > div:not(.media) {
		padding: 16px 18px 20px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.latest {
		display: block;
		margin-top: auto;
		padding-top: 14px;
		border-top: 1px dashed var(--line);
		font-size: 15px;
		font-weight: 600;
		line-height: 1.3;
	}
	.latest .mono {
		display: block;
		font-weight: 400;
		font-size: 11px;
		margin-bottom: 2px;
	}
	.card > div:not(.media) > p {
		margin-bottom: 14px;
	}
	.media {
		position: relative;
	}
	.kind {
		position: absolute;
		left: 12px;
		top: 12px;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 3px 9px;
		border-radius: 6px;
		background: var(--bg-raised);
		color: var(--ink);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
	}
	.kind::before {
		content: '';
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		margin-right: 6px;
		vertical-align: 1px;
		background: var(--kind);
	}
	.kind-ai {
		--kind: #c4a5ff;
	}
	.kind-game {
		--kind: #7ee2a2;
	}
	.kind-web {
		--kind: #7aa5ff;
	}
	.kind-tool {
		--kind: #ffb27a;
	}
	h3 {
		margin: 8px 0 6px;
		font-size: 22px;
	}
	p {
		margin: 0;
		color: var(--muted);
		font-size: 15px;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
