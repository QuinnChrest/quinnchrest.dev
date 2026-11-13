<script lang="ts">
	import type { Photo } from '$lib/types';

	let { photos }: { photos: Photo[] } = $props();
</script>

<ul class="strip">
	{#each photos as photo, i (photo.id)}
		<li style="--tilt: {[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg">
			<a href={photo.url} target="_blank" rel="noopener" aria-label="Open photo on photos.quinnchrest.dev">
				<picture>
					<source srcset={photo.avif} type="image/avif" />
					<source srcset={photo.webp} type="image/webp" />
					<img src={photo.jpg} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
				</picture>
			</a>
		</li>
	{/each}
</ul>

<style>
	.strip {
		list-style: none;
		margin: 0;
		padding: 8px 0 0;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 16px;
	}
	a {
		display: block;
		padding: 8px 8px 22px;
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: 6px;
		box-shadow: var(--shadow);
		transform: rotate(var(--tilt));
		transition: transform 0.2s;
	}
	a:hover,
	a:focus-visible {
		transform: rotate(0) scale(1.05);
		position: relative;
		z-index: 1;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 3px;
		background: var(--line);
	}
	@media (max-width: 900px) {
		.strip {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (max-width: 520px) {
		.strip {
			gap: 12px;
		}
		a {
			padding: 5px 5px 14px;
		}
	}
</style>
