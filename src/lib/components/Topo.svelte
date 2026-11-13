<script lang="ts">
	// Decorative contour background. Drawn on the server from a fixed seed, so no
	// JavaScript is needed to show it and it looks the same on every build.
	import { contours, DEFAULT_PEAKS, type Peak } from '$lib/topo';

	let { seed = 1, peaks = DEFAULT_PEAKS, height = 760 }: { seed?: number; peaks?: Peak[]; height?: number } = $props();

	const paths = $derived(contours(seed, peaks, height));
</script>

<svg viewBox="0 0 1200 {height}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="height: {height}px">
	{#each paths as p}
		<path d={p.d} stroke-width={p.index ? 1.6 : 0.8} pathLength="1" style="--ring: {p.ring}" />
	{/each}
</svg>

<style>
	svg {
		position: absolute;
		inset: 0 0 auto 0;
		width: 100%;
		z-index: -1;
		pointer-events: none;
		mask-image: linear-gradient(to bottom, #000 60%, transparent);
	}
	path {
		fill: none;
		stroke: var(--contour);
	}
	/* On the first page of a visit, the lines trace themselves outward from
	   each peak. `draw-topo` is set before paint by a script in app.html and
	   removed on the first navigation (in +layout.svelte). */
	:global(:root.draw-topo) path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		animation-delay: calc(var(--ring) * 55ms);
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
