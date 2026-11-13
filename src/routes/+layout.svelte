<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Topo from '$lib/components/Topo.svelte';

	let { children } = $props();

	const home = $derived(page.url.pathname === '/');

	// Elements with data-morph="<name>" glide between pages when the same name
	// is on both (project images: Trailhead.svelte and projects/[slug]). Only
	// ones actually on screen get a name; an off-screen one (say, a card further
	// down a page that opens at the top) would make the image fly to or from
	// somewhere you can't see, so it just crossfades with the page instead.
	function nameVisibleMorphs() {
		for (const el of document.querySelectorAll<HTMLElement>('[data-morph]')) {
			const r = el.getBoundingClientRect();
			const onScreen = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
			el.style.viewTransitionName = onScreen ? el.dataset.morph! : 'none';
		}
	}

	// Smooth page changes: a quick crossfade, with on-screen project images
	// gliding into place. Browsers without the View Transitions API just switch
	// pages instantly.
	onNavigate((navigation) => {
		if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Same-page changes (like #stats) don't need a transition.
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		// Back and forward should be instant and land exactly where you were.
		// Some browsers (Firefox) only restore the scroll position after a view
		// transition finishes, so animating here showed the top of the page
		// first and then jumped.
		if (navigation.type === 'popstate') return;
		nameVisibleMorphs(); // the page we're leaving, as it is now
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				// Resolves after the new page renders and its scroll is restored.
				await navigation.complete;
				nameVisibleMorphs(); // the page we're arriving at
			});
		});
	});
</script>

<div class="page">
	<!-- Remounted per page, so each page picks a new random map. -->
	{#key page.url.pathname}
		<Topo height={home ? 820 : 460} />
	{/key}
	<a class="skip" href="#main">Skip to content</a>
	<Header />
	<main id="main">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.page {
		position: relative;
		isolation: isolate;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		overflow-x: clip;
	}
	.skip {
		position: absolute;
		left: 16px;
		top: -60px;
		background: var(--ink);
		color: var(--bg);
		padding: 8px 14px;
		border-radius: 8px;
		z-index: 10;
	}
	.skip:focus {
		top: 12px;
	}
</style>
