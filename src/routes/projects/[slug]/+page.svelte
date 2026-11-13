<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Trail from '$lib/components/Trail.svelte';
	import { noteToTrail, statusLabel } from '$lib/format';

	let { data } = $props();
	const p = $derived(data.project);
</script>

<Seo title="{p.title} | Quinn Chrest" description={p.description.slice(0, 200)} image={p.image} />

<div class="wrap">
	<a class="mono back" href="/projects">← All projects</a>

	<article>
		<div class="text">
			<span class="mono marker" class:wip={p.status !== 'completed'}>{statusLabel[p.status]}</span>
			<h1>{p.title}</h1>
			<div class="prose">{@html p.html}</div>

			<div class="links">
				{#if p.liveUrl}<a class="btn primary" href={p.liveUrl} target="_blank" rel="noopener">Open it ↗</a>{/if}
				{#if p.githubUrl}<a class="btn" href={p.githubUrl} target="_blank" rel="noopener">Source on GitHub ↗</a>{/if}
			</div>

			{#if p.technologies.length}
				<h2 class="mono">Built with</h2>
				<ul class="tech">
					{#each p.technologies as t}<li>{t}</li>{/each}
				</ul>
			{/if}
		</div>
		<img
			src={p.image}
			alt="Screenshot or artwork for {p.title}"
			width="800"
			height="600"
			data-morph="project-{p.slug}"
		/>
	</article>

	{#if data.notes.length}
		<section aria-labelledby="notes">
			<div class="section-head">
				<h2 id="notes">Notes</h2>
				<a class="mono" href="/notes">All project notes →</a>
			</div>
			<Trail items={data.notes.map((n) => noteToTrail(n))} />
		</section>
	{/if}
</div>

<style>
	.back {
		display: inline-block;
		margin-top: 40px;
	}
	.back:hover {
		color: var(--trail);
	}
	article {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 48px;
		align-items: start;
		padding-top: 24px;
	}
	h1 {
		font-size: clamp(40px, 6vw, 68px);
		font-weight: 800;
		margin: 12px 0 20px;
	}
	img {
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: var(--radius);
		border: 1px solid var(--line);
		box-shadow: var(--shadow);
		position: sticky;
		top: 24px;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 8px 0 28px;
	}
	.btn {
		padding: 10px 18px;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: var(--bg-raised);
		font-weight: 600;
	}
	.btn:hover {
		border-color: var(--trail);
		color: var(--trail);
	}
	.btn.primary {
		background: var(--trail);
		border-color: var(--trail);
		color: #fff;
	}
	.btn.primary:hover {
		filter: brightness(1.08);
		color: #fff;
	}
	h2.mono {
		margin: 0 0 10px;
		font-weight: 500;
	}
	.tech {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tech li {
		font-family: var(--font-mono);
		font-size: 13px;
		padding: 3px 10px;
		border: 1px solid var(--line);
		border-radius: 99px;
	}
	@media (max-width: 800px) {
		article {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		img {
			order: -1;
			position: static;
		}
		.back {
			margin-top: 24px;
		}
	}
</style>
