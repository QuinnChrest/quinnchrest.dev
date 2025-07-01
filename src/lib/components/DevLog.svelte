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
	
	let devLogEntries: DevLogEntry[] = [
		{
			id: '1',
			date: '2024-01-15',
			title: 'Portfolio Website Launch',
			content: 'Built and deployed my new portfolio website using SvelteKit. Features include a modern design, dev log, projects showcase, and blog section. Used Tailwind CSS for styling and implemented smooth scrolling navigation.',
			tags: ['SvelteKit', 'Tailwind CSS', 'Portfolio'],
			category: 'feature'
		},
		{
			id: '2',
			date: '2024-01-10',
			title: 'Learning Svelte 5',
			content: 'Started exploring Svelte 5\'s new runes system. The new syntax is more intuitive and the performance improvements are impressive. Working on migrating some existing components to test the new features.',
			tags: ['Svelte 5', 'Learning', 'Frontend'],
			category: 'learning'
		},
		{
			id: '3',
			date: '2024-01-05',
			title: 'API Integration Bug Fix',
			content: 'Fixed a critical bug in the authentication system where tokens weren\'t being properly refreshed. The issue was related to timing in the refresh token logic. Added proper error handling and retry mechanisms.',
			tags: ['API', 'Authentication', 'Bug Fix'],
			category: 'bugfix'
		}
	];
	
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
</script>

<div class="space-y-6">
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
						<time class="text-sm text-[#8b949e]">{entry.date}</time>
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
</div> 