<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Topo from '$lib/components/Topo.svelte';

	let { children } = $props();

	const home = $derived(page.url.pathname === '/');

	// Smooth page changes: crossfade between pages, and a project card's image
	// glides into place on the project page (matching view-transition-names in
	// Trailhead.svelte and projects/[slug]). Browsers without the View
	// Transitions API just switch pages instantly.
	onNavigate((navigation) => {
		if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Same-page changes (like #stats) don't need a transition.
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
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
