<script lang="ts">
	import { onMount } from 'svelte';
	
	interface DevLogEntry {
		id: string;
		date: string;
		title: string;
		content: string;
		tags: string[];
		category: 'feature' | 'bugfix' | 'learning' | 'update';
	}
	
	let devLogEntries: DevLogEntry[] = [];
	let loading = true;
	let error: string | null = null;
	
	async function fetchDevLogEntries() {
		try {
			loading = true;
			error = null;
			const response = await fetch('/api/devlog');
			if (!response.ok) {
				throw new Error('Failed to fetch devlog entries');
			}
			devLogEntries = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			console.error('Error fetching devlog entries:', err);
		} finally {
			loading = false;
		}
	}
	
	onMount(() => {
		fetchDevLogEntries();
	});
	
	function getCategoryColor(category: DevLogEntry['category']) {
		switch (category) {
			case 'feature': return 'bg-[#238636]/20 text-[#7ee787] border-[#238636]/30';
			case 'bugfix': return 'bg-[#da3633]/20 text-[#f85149] border-[#da3633]/30';
			case 'learning': return 'bg-[#1f6feb]/20 text-[#79c0ff] border-[#1f6feb]/30';
			case 'update': return 'bg-[#9e6a03]/20 text-[#f2cc60] border-[#9e6a03]/30';
			default: return 'bg-[#484f58]/20 text-[#8b949e] border-[#484f58]/30';
		}
	}
	
	function getCategoryIcon(category: DevLogEntry['category']) {
		switch (category) {
			case 'feature': return '✨';
			case 'bugfix': return '🐛';
			case 'learning': return '📚';
			case 'update': return '📝';
			default: return '📄';
		}
	}
	
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
	}
</script>

<div class="space-y-6">
	<!-- Header with RSS Feed Link -->
	<div class="flex justify-between items-center mb-6">
		<h2 class="text-2xl font-bold text-[#f0f6fc]">Dev Log</h2>
		<a 
			href="/api/feed.xml" 
			target="_blank" 
			rel="noopener noreferrer"
			class="flex items-center space-x-2 px-3 py-2 bg-[#30363d] hover:bg-[#484f58] text-[#8b949e] rounded-lg transition-colors text-sm"
			title="Subscribe to RSS Feed"
		>
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"/>
				<path d="M4 9a1 1 0 011-1 7.004 7.004 0 016.993 6.994 1 1 0 11-1.999.012A5.002 5.002 0 005 10a1 1 0 01-1-1z"/>
				<path d="M3 15a2 2 0 114 0 2 2 0 01-4 0z"/>
			</svg>
			<span>RSS Feed</span>
		</a>
	</div>

	<!-- Loading State -->
	{#if loading}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">⏳</div>
			<h3 class="text-xl font-semibold text-[#f0f6fc] mb-2">Loading dev log entries...</h3>
			<p class="text-[#8b949e]">Please wait while we fetch your latest updates.</p>
		</div>
	{:else if error}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">❌</div>
			<h3 class="text-xl font-semibold text-[#f0f6fc] mb-2">Error loading dev log</h3>
			<p class="text-[#8b949e] mb-4">{error}</p>
			<button 
				on:click={fetchDevLogEntries}
				class="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
			>
				Try Again
			</button>
		</div>
	{:else}
		<!-- Dev Log Timeline -->
		<div class="space-y-6">
			{#each devLogEntries as entry, index}
				<div class="relative">
					<!-- Entry Card -->
					<div class="relative bg-[#21262d] border border-[#30363d] rounded-lg p-6 hover:bg-[#30363d] transition-all duration-300">
						<!-- Category Badge -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center space-x-3">
								<div class="w-12 h-12 bg-[#30363d] rounded-full flex items-center justify-center text-2xl">
									{getCategoryIcon(entry.category)}
								</div>
								<div>
									<span class="inline-block px-3 py-1 text-xs font-medium rounded-full border {getCategoryColor(entry.category)}">
										{entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
									</span>
								</div>
							</div>
							<time class="text-sm text-[#8b949e]">{formatDate(entry.date)}</time>
						</div>
						
						<!-- Title -->
						<h3 class="text-xl font-semibold text-[#f0f6fc] mb-3">{entry.title}</h3>
						
						<!-- Content -->
						<p class="text-[#8b949e] leading-relaxed mb-4">{entry.content}</p>
						
						<!-- Tags -->
						{#if entry.tags.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each entry.tags as tag}
									<span class="px-2 py-1 bg-[#30363d] text-[#8b949e] text-xs rounded-md">
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		
		<!-- Empty State -->
		{#if devLogEntries.length === 0}
			<div class="text-center py-12">
				<div class="text-6xl mb-4">📝</div>
				<h3 class="text-xl font-semibold text-[#f0f6fc] mb-2">No dev log entries yet</h3>
				<p class="text-[#8b949e]">Your development journey will appear here!</p>
			</div>
		{/if}
	{/if}
</div> 