<script lang="ts">
	import type { Project } from '$lib/types';
	import { statusLabel } from '$lib/format';

	let { project, eager = false }: { project: Project; eager?: boolean } = $props();
	const wip = $derived(project.status !== 'completed');
</script>

<a class="card" href="/projects/{project.slug}">
	<img src={project.image} alt="" loading={eager ? 'eager' : 'lazy'} width="600" height="400" />
	<div>
		<span class="mono marker" class:wip>
			{wip ? statusLabel[project.status] + ' · ' : ''}{project.technologies.slice(0, 2).join(' · ')}
		</span>
		<h3>{project.title}</h3>
		<p>{project.description}</p>
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
	div {
		padding: 16px 18px 20px;
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
