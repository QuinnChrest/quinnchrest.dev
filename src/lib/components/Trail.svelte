<script lang="ts">
	import type { DevLogEntry } from '$lib/types';
	import { categoryLabel, formatDate } from '$lib/format';

	let { entries }: { entries: DevLogEntry[] } = $props();
</script>

<ol class="trail">
	{#each entries as entry (entry.slug)}
		<li>
			<a class="stop" href="/log/{entry.slug}">
				<span class="mono">
					<time datetime={entry.date.slice(0, 10)}>{formatDate(entry.date, 'short')}</time><br />
					{categoryLabel[entry.category]} · {entry.readingMinutes} min
				</span>
				<div>
					<h3>
						{entry.title}
						{#if entry.visibility !== 'published'}<span class="pending">{entry.visibility}</span>{/if}
					</h3>
					<p>{entry.excerpt}</p>
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
	.stop:hover h3 {
		color: var(--trail);
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
	@media (max-width: 800px) {
		.stop {
			grid-template-columns: 1fr;
			gap: 4px;
		}
		.trail {
			--pad: 32px;
		}
	}
</style>
