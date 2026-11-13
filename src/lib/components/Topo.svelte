<script lang="ts" module>
	// Shared by every Topo on this page load (module scope, not per component):
	// true after the first map, so maps shown on later navigations draw faster.
	let drawnBefore = false;
</script>

<script lang="ts">
	// Decorative contour background. Each page load (and each navigation, since
	// +layout.svelte remounts this per page) draws one of the 15 maps in
	// $lib/topo-maps at random, never the same one twice in a row. The choice
	// happens in the browser, so the prerendered HTML has no map; without
	// JavaScript the background is simply plain.
	//
	// Every new map draws itself in, tracing outward from the peaks: the full
	// version on a page load, a quicker one when moving between pages.
	import { onMount } from 'svelte';
	import { contours } from '$lib/topo';
	import { MAPS } from '$lib/topo-maps';

	let { height = 760 }: { height?: number } = $props();

	let index = $state<number | null>(null);
	let quick = $state(false);
	const paths = $derived(index === null ? [] : contours(MAPS[index].seed, MAPS[index].peaks, height));

	const LAST_KEY = 'topo-last';

	onMount(() => {
		quick = drawnBefore;
		drawnBefore = true;
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

<svg
	viewBox="0 0 1200 {height}"
	preserveAspectRatio="xMidYMid slice"
	aria-hidden="true"
	style="height: {height}px"
	class:quick
>
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
	/* Lines trace themselves outward from each peak. Only with motion allowed:
	   the hidden starting state must never apply when animations are off. */
	@media (prefers-reduced-motion: no-preference) {
		path {
			stroke-dasharray: 1;
			stroke-dashoffset: 1;
			animation: draw 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
			animation-delay: calc(var(--ring) * 55ms);
		}
		.quick path {
			animation-duration: 0.8s;
			animation-delay: calc(var(--ring) * 25ms);
		}
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
