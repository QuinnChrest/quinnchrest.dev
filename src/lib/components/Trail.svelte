<script lang="ts">
	import type { TrailItem } from '$lib/types';
	import { formatDate } from '$lib/format';
	import { reveal } from '$lib/reveal';

	let { items }: { items: TrailItem[] } = $props();

	// The line takes about 0.25s per stop to draw (capped), and each stop
	// appears as the line reaches it.
	const drawMs = $derived(Math.min(1600, 250 * items.length + 200));
</script>

<ol class="trail" use:reveal style="--draw: {drawMs}ms; --n: {items.length}">
	{#each items as item, i (item.key)}
		<li style="--i: {i}">
			<a
				class="stop"
				href={item.href}
				target={item.external ? '_blank' : undefined}
				rel={item.external ? 'noopener' : undefined}
			>
				<span class="mono">
					<time datetime={item.date.slice(0, 10)}>{formatDate(item.date, 'short')}</time><br />
					{item.meta}
				</span>
				<div class="body" class:has-image={item.image}>
					<div>
						{#if item.title}
							<h3>
								{item.title}
								{#if item.pending}<span class="pending">{item.pending}</span>{/if}
							</h3>
							<p>{item.excerpt}</p>
						{:else}
							<!-- Untitled posts (most micro.blog posts): the text is the headline. -->
							<p class="lead">{item.excerpt}</p>
						{/if}
					</div>
					{#if item.image}
						<img src={item.image} alt="" loading="lazy" width="96" height="96" />
					{/if}
				</div>
			</a>
		</li>
	{/each}
</ol>

<style>
	/* --pad is the gap between the line and the text. The dot is centered on
	   the 3px line: line center is 1.5px in, the dot is 15px wide. */
	.trail {
		--pad: 40px;
		position: relative;
		list-style: none;
		margin: 10px 0 0 10px;
		padding: 0 0 0 var(--pad);
	}
	.trail::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10px;
		bottom: 24px;
		border-left: 3px dashed var(--trail);
	}
	li {
		position: relative;
	}
	li::before {
		content: '';
		position: absolute;
		left: calc(1.5px - 7.5px - var(--pad));
		top: 4px;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: var(--bg);
		border: 3px solid var(--trail);
	}
	li:first-child::before {
		background: var(--trail);
	}
	.stop {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 20px;
		padding: 0 0 36px;
	}
	.stop:hover h3,
	.stop:hover .lead {
		color: var(--trail);
	}
	.body {
		display: flex;
		gap: 18px;
		align-items: flex-start;
	}
	.body > div {
		flex: 1;
		min-width: 0;
	}
	.body img {
		flex: none;
		width: 96px;
		height: 96px;
		object-fit: cover;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: var(--line);
	}
	.lead {
		color: var(--ink);
		font-size: 19px;
		line-height: 1.45;
	}
	h3 {
		margin: 0 0 4px;
		font-size: 24px;
		line-height: 1.2;
	}
	p {
		margin: 0;
		color: var(--muted);
		max-width: 620px;
	}
	/* Only seen in `npm run dev`: drafts and future posts aren't built. */
	.pending {
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		vertical-align: middle;
		border: 1px dashed var(--trail);
		color: var(--trail);
		border-radius: 4px;
		padding: 1px 6px;
		margin-left: 6px;
	}
	/* Draw-in animation (see $lib/reveal): the dashed line grows downward and
	   each stop's dot pops in, then its text slides in, as the line reaches it. */
	.trail:global([data-reveal])::before {
		transform-origin: top;
		transition: transform var(--draw) cubic-bezier(0.45, 0, 0.25, 1);
	}
	.trail:global([data-reveal]) li::before {
		transition:
			transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.2s;
		transition-delay: calc(var(--draw) * var(--i) / var(--n));
	}
	.trail:global([data-reveal]) .stop {
		transition:
			transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1),
			opacity 0.5s;
		transition-delay: calc(var(--draw) * var(--i) / var(--n) + 80ms);
	}
	.trail:global([data-reveal='armed'])::before {
		transform: scaleY(0);
	}
	.trail:global([data-reveal='armed']) li::before {
		transform: scale(0);
		opacity: 0;
	}
	.trail:global([data-reveal='armed']) .stop {
		transform: translateX(-12px);
		opacity: 0;
	}
	@media (max-width: 800px) {
		.stop {
			grid-template-columns: 1fr;
			gap: 4px;
		}
		.trail {
			--pad: 32px;
		}
		.body img {
			width: 72px;
			height: 72px;
		}
	}
</style>
