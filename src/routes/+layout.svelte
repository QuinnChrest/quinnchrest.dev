<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Topo from '$lib/components/Topo.svelte';

	let { children } = $props();

	// Each page gets its own (stable) contour map, seeded from its path.
	const seed = $derived([...page.url.pathname].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100000, 7));
	const home = $derived(page.url.pathname === '/');
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Quinn Chrest - Dev Log" href="/api/feed.xml" />
</svelte:head>

<div class="page">
	{#key seed}
		<Topo
			{seed}
			height={home ? 820 : 460}
			peaks={home
				? undefined
				: [
						{ x: 1050, y: 120, rings: 11 },
						{ x: 120, y: 420, rings: 6 }
					]}
		/>
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
