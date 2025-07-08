<script lang="ts">
	import { onMount } from 'svelte';
	import DevLog from '$lib/components/DevLog.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { fade } from 'svelte/transition';

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
	<title>Quinn Chrest - Developer Portfolio</title>
	<meta name="description" content="Developer portfolio showcasing projects, dev log, and GitHub stats" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="alternate" type="application/rss+xml" title="Quinn Chrest - Dev Log RSS Feed" href="/api/feed.xml" />
</svelte:head>

<main class="min-h-screen bg-[#0d1117] text-white overflow-hidden">
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
						<Projects />
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
						<DevLog />
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
