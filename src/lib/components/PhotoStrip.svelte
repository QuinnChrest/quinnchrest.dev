<script lang="ts">
	import type { Photo } from '$lib/types';

	let { photos }: { photos: Photo[] } = $props();

	// Clicking a photo opens it larger right here instead of leaving the site.
	// The links still point at photos.quinnchrest.dev, so they work without
	// JavaScript, in a new tab (middle/ctrl-click) or when shared.
	let dialog: HTMLDialogElement;
	let index = $state(0);
	const current = $derived(photos[index]);

	function open(e: MouseEvent, i: number) {
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		index = i;
		dialog.showModal();
	}

	const step = (d: number) => (index = (index + d + photos.length) % photos.length);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
	}

	// Swipe left/right on touch screens.
	let touchX = 0;
	const onTouchStart = (e: TouchEvent) => (touchX = e.changedTouches[0].clientX);
	function onTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchX;
		if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
	}
</script>

<ul class="strip">
	{#each photos as photo, i (photo.id)}
		<li style="--tilt: {[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg">
			<a href={photo.url} onclick={(e) => open(e, i)} aria-label="View photo {i + 1} of {photos.length}">
				<picture>
					<source srcset={photo.avif} type="image/avif" />
					<source srcset={photo.webp} type="image/webp" />
					<img src={photo.jpg} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
				</picture>
			</a>
		</li>
	{/each}
</ul>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclick={(e) => e.target === dialog && dialog.close()}
	onkeydown={onKeydown}
	ontouchstart={onTouchStart}
	ontouchend={onTouchEnd}
	aria-label="Photo viewer"
>
	{#if current}
		<figure>
			{#key current.id}
				<picture>
					<source srcset={current.large.avif} type="image/avif" />
					<source srcset={current.large.webp} type="image/webp" />
					<img src={current.large.jpg} alt={current.alt} width={current.width} height={current.height} />
				</picture>
			{/key}
			<figcaption>
				<span class="mono">{index + 1} / {photos.length}</span>
				<a class="mono" href={current.url} target="_blank" rel="noopener">See it on photos.quinnchrest.dev ↗</a>
			</figcaption>
		</figure>
		<button class="nav prev" onclick={() => step(-1)} aria-label="Previous photo">‹</button>
		<button class="nav next" onclick={() => step(1)} aria-label="Next photo">›</button>
		<!-- svelte-ignore a11y_autofocus -->
		<button class="close" onclick={() => dialog.close()} aria-label="Close" autofocus>✕</button>
	{/if}
</dialog>

<style>
	.strip {
		list-style: none;
		margin: 0;
		padding: 8px 0 0;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 16px;
	}
	.strip a {
		display: block;
		padding: 8px 8px 22px;
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: 6px;
		box-shadow: var(--shadow);
		transform: rotate(var(--tilt));
		transition: transform 0.2s;
		cursor: zoom-in;
	}
	.strip a:hover,
	.strip a:focus-visible {
		transform: rotate(0) scale(1.05);
		position: relative;
		z-index: 1;
	}
	.strip img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 3px;
		background: var(--line);
	}

	dialog {
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		background: rgba(8, 11, 9, 0.92);
		color: #e9e4d4;
	}
	dialog[open] {
		display: grid;
		place-items: center;
	}
	dialog::backdrop {
		background: transparent;
	}
	figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		max-width: calc(100vw - 140px);
	}
	figure img {
		display: block;
		max-width: 100%;
		max-height: calc(100dvh - 120px);
		width: auto;
		height: auto;
		border-radius: 6px;
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
	}
	figcaption {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		justify-content: center;
	}
	figcaption .mono {
		color: #9aa392;
	}
	figcaption a:hover {
		color: #ff7448;
	}
	button {
		position: absolute;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(20, 26, 21, 0.7);
		color: #e9e4d4;
		border-radius: 50%;
		cursor: pointer;
		display: grid;
		place-items: center;
		font: inherit;
	}
	button:hover {
		border-color: #ff7448;
		color: #ff7448;
	}
	.nav {
		top: 50%;
		width: 48px;
		height: 48px;
		margin-top: -24px;
		font-size: 30px;
		line-height: 1;
		padding-bottom: 4px;
	}
	.prev {
		left: 20px;
	}
	.next {
		right: 20px;
	}
	.close {
		top: 18px;
		right: 20px;
		width: 40px;
		height: 40px;
		font-size: 16px;
	}
	@media (max-width: 900px) {
		.strip {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (max-width: 600px) {
		.strip {
			gap: 12px;
		}
		.strip a {
			padding: 5px 5px 14px;
		}
		figure {
			max-width: calc(100vw - 24px);
		}
		.nav {
			top: auto;
			bottom: 18px;
			margin-top: 0;
		}
		.prev {
			left: calc(50% - 64px);
		}
		.next {
			right: calc(50% - 64px);
		}
		figure img {
			max-height: calc(100dvh - 170px);
		}
	}
</style>
