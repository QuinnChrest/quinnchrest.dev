<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let currentSection: string = 'projects';
	
	const dispatch = createEventDispatcher();
	
	const navItems = [
		{ id: 'projects', label: 'Projects' },
		{ id: 'devlog', label: 'Dev Log' },
		{ id: 'stats', label: 'GitHub Stats' }
	];
	
	function handleNavClick(section: string) {
		dispatch('sectionChange', section);
	}
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d]">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo/Avatar -->
			<div class="flex items-center space-x-2">
				<img src="/avatar.jpg" alt="Avatar" class="w-9 h-9 rounded-full border-2 border-[#30363d] shadow-sm object-cover" />
				<span class="text-xl font-bold text-[#f0f6fc]">
					Quinn Chrest
				</span>
			</div>
			
			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-8">
				{#each navItems as item}
					<button
						class="relative px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#58a6ff] {currentSection === item.id ? 'text-[#58a6ff]' : 'text-[#8b949e]'}"
						on:click={() => handleNavClick(item.id)}
					>
						{item.label}
						{#if currentSection === item.id}
							<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#58a6ff]"></div>
						{/if}
					</button>
				{/each}
			</div>
			
			<!-- Mobile Menu Button -->
			<button class="md:hidden p-2 text-[#8b949e] hover:text-[#f0f6fc]">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
			</button>
		</div>
	</div>
</nav>

<!-- Mobile Navigation (Hidden by default) -->
<div class="md:hidden fixed top-16 left-0 right-0 bg-[#161b22]/95 backdrop-blur-md border-b border-[#30363d] transform -translate-y-full transition-transform duration-300">
	<div class="container mx-auto px-4 py-4">
		<div class="flex flex-col space-y-4">
			{#each navItems as item}
				<button
					class="text-left px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#58a6ff] {currentSection === item.id ? 'text-[#58a6ff]' : 'text-[#8b949e]'}"
					on:click={() => handleNavClick(item.id)}
				>
					{item.label}
				</button>
			{/each}
		</div>
	</div>
</div> 