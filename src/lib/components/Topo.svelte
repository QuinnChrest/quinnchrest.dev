<script lang="ts">
	// Decorative contour background. Each page load (and each navigation, since
	// +layout.svelte remounts this per page) draws one of the 15 maps in
	// $lib/topo-maps at random, never the same one twice in a row. The choice
	// happens in the browser, so the prerendered HTML has no map; without
	// JavaScript the background is simply plain.
	import { onMount } from 'svelte';
	import { contours } from '$lib/topo';
	import { MAPS } from '$lib/topo-maps';

	let { height = 760 }: { height?: number } = $props();

	let index = $state<number | null>(null);
	const paths = $derived(index === null ? [] : contours(MAPS[index].seed, MAPS[index].peaks, height));

	const LAST_KEY = 'topo-last';

	onMount(() => {
		let last = -1;
		try {
			last = Number(sessionStorage.getItem(LAST_KEY) ?? -1);
		} catch {
			// Storage blocked: repeats are just a little more likely.
		}
		let next = Math.floor(Math.random() * (MAPS.length - 1));
		if (next >= last && last >= 0) next++; // skip the previous map
		index = next;
		try {
			sessionStorage.setItem(LAST_KEY, String(next));
		} catch {
			// Ignore.
		}
	});
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
	/* Later pages: the map fades in instead of popping in. */
	:global(:root:not(.draw-topo)) svg {
		animation: fade 0.45s ease-out both;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
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
