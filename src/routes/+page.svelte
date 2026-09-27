<script lang="ts">
	import { onMount } from 'svelte';
	import DevLog from '$lib/components/DevLog.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;

	const siteUrl = 'https://quinnchrest.dev';
	const title = 'Quinn Chrest | Software Developer Portfolio';
	const description =
		'Quinn Chrest is a software developer in Chanhassen, MN. Browse projects built with Svelte, TypeScript and more, read the dev log, and see live GitHub stats.';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${siteUrl}/#website`,
				url: `${siteUrl}/`,
				name: 'Quinn Chrest',
				description,
				publisher: { '@id': `${siteUrl}/#person` }
			},
			{
				'@type': 'Person',
				'@id': `${siteUrl}/#person`,
				name: 'Quinn Chrest',
				url: `${siteUrl}/`,
				image: `${siteUrl}/avatar.jpg`,
				jobTitle: 'Software Developer',
				address: { '@type': 'PostalAddress', addressLocality: 'Chanhassen', addressRegion: 'MN', addressCountry: 'US' },
				sameAs: [
					'https://github.com/QuinnChrest',
					'https://www.linkedin.com/in/quinn-chrest-533581140/',
					'https://quinnchrest.com/'
				]
			}
		]
	};

	let currentSection = 'projects';
	let slideDirection = 'right'; // 'left' or 'right'
	let isTransitioning = false;
	let touchStartX = 0;
	let touchEndX = 0;
	let showHint = true;

	function switchSection(newSection: string) {
		if (newSection === currentSection || isTransitioning) return;
		
		// Determine slide direction based on section order
		const sectionOrder = ['projects', 'devlog', 'stats'];
		const currentIndex = sectionOrder.indexOf(currentSection);
		const newIndex = sectionOrder.indexOf(newSection);
		
		slideDirection = newIndex > currentIndex ? 'right' : 'left';
		currentSection = newSection;
		isTransitioning = true;
		
		// Reset transition flag after animation
		setTimeout(() => {
			isTransitioning = false;
		}, 300);
	}

	function handleScroll(e: Event) {
		const el = e.target as HTMLElement;
		const isMobile = window.innerWidth < 768;
		if (!isMobile) {
			showHint = true;
			return;
		}
		const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
		showHint = !atBottom;
	}

	onMount(() => {
		// Add keyboard navigation
		const handleKeydown = (e: KeyboardEvent) => {
			const sectionOrder = ['projects', 'devlog', 'stats'];
			const idx = sectionOrder.indexOf(currentSection);
			if (e.key === 'ArrowLeft' && idx > 0) {
				switchSection(sectionOrder[idx - 1]);
			} else if (e.key === 'ArrowRight' && idx < sectionOrder.length - 1) {
				switchSection(sectionOrder[idx + 1]);
			}
		};

		// Add touch/swipe support
		const handleTouchStart = (e: TouchEvent) => {
			touchStartX = e.changedTouches[0].screenX;
		};

		const handleTouchEnd = (e: TouchEvent) => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		};

		const handleSwipe = () => {
			const swipeThreshold = 50;
			const diff = touchStartX - touchEndX;
			const sectionOrder = ['projects', 'devlog', 'stats'];
			const idx = sectionOrder.indexOf(currentSection);
			if (Math.abs(diff) > swipeThreshold) {
				if (diff > 0 && idx < sectionOrder.length - 1) {
					switchSection(sectionOrder[idx + 1]);
				} else if (diff < 0 && idx > 0) {
					switchSection(sectionOrder[idx - 1]);
				}
			}
		};

		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('touchstart', handleTouchStart);
		document.addEventListener('touchend', handleTouchEnd);
		
		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('touchend', handleTouchEnd);
		};
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{siteUrl}/" />
	<link rel="alternate" type="application/rss+xml" title="Quinn Chrest - Dev Log RSS Feed" href="/api/feed.xml" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Quinn Chrest" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{siteUrl}/" />
	<meta property="og:image" content="{siteUrl}/avatar.jpg" />
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />
	<meta property="og:image:alt" content="Photo of Quinn Chrest" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{siteUrl}/avatar.jpg" />

	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<main class="min-h-screen bg-[#0d1117] text-white overflow-hidden">
	<h1 class="sr-only">Quinn Chrest, Software Developer</h1>
	<Navigation {currentSection} on:sectionChange={(e) => switchSection(e.detail)} />
	
	<!-- Slide Container -->
	<div class="relative w-full h-screen overflow-hidden">
		<!-- Projects Section -->
		<div 
			class="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
			style="transform: translateX({currentSection === 'projects' ? '0%' : currentSection === 'devlog' ? '-100%' : currentSection === 'stats' ? '-200%' : '0%'})"
		>
			<div class="w-full h-full flex flex-col">
				<div class="flex-1 overflow-y-auto pb-24 md:pb-8" on:scroll={handleScroll}>
					<div class="max-w-6xl mx-auto px-4 pt-20">
						<Projects projects={data.projects} />
					</div>
				</div>
			</div>
		</div>

		<!-- Dev Log Section -->
		<div 
			class="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
			style="transform: translateX({currentSection === 'devlog' ? '0%' : currentSection === 'projects' ? '100%' : currentSection === 'stats' ? '-100%' : '0%'})"
		>
			<div class="w-full h-full flex flex-col">
				<div class="flex-1 overflow-y-auto pb-24 md:pb-8" on:scroll={handleScroll}>
					<div class="max-w-6xl mx-auto px-4 pt-20">
						<DevLog entries={data.devlog} />
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Section -->
		<div 
			class="absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out"
			style="transform: translateX({currentSection === 'stats' ? '0%' : currentSection === 'devlog' ? '100%' : currentSection === 'projects' ? '200%' : '0%'})"
		>
			<div class="w-full h-full flex flex-col">
				<div class="flex-1 overflow-y-auto pb-24 md:pb-8" on:scroll={handleScroll}>
					<div class="max-w-6xl mx-auto px-4 pt-20">
						<Stats />
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Navigation Hint -->
	{#if showHint}
		<div class="fixed bottom-4 right-4 text-xs text-gray-400 bg-[#161b22]/80 backdrop-blur-sm border border-[#30363d] rounded-lg px-3 py-2" transition:fade={{ duration: 250 }}>
			<div class="hidden md:block">Use ← → keys to navigate</div>
			<div class="md:hidden">Swipe left/right to navigate</div>
		</div>
	{/if}
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
	
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		overflow: hidden;
	}
	
	/* Custom scrollbar for content areas */
	:global(.overflow-y-auto::-webkit-scrollbar) {
		width: 6px;
	}
	
	:global(.overflow-y-auto::-webkit-scrollbar-track) {
		background: transparent;
	}
	
	:global(.overflow-y-auto::-webkit-scrollbar-thumb) {
		background: rgba(64, 64, 64, 0.5);
		border-radius: 3px;
	}
	
	:global(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
		background: rgba(82, 82, 82, 0.8);
	}
</style>
