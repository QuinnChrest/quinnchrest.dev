<script lang="ts">
	import { onMount } from 'svelte';
	
	interface DevLogEntry {
		id: string;
		title: string;
		content: string;
		category: 'feature' | 'bug-fix' | 'learning' | 'update';
		tags: string[];
		date: string;
	}
	
	let entries: DevLogEntry[] = [];
	let loading = true;
	let error = '';
	let showForm = false;
	let editingEntry: DevLogEntry | null = null;
	
	// Form data
	let formData = {
		title: '',
		content: '',
		category: 'feature' as DevLogEntry['category'],
		tags: '',
		date: new Date().toISOString().split('T')[0]
	};
	
	onMount(() => {
		// Check authentication
		const auth = sessionStorage.getItem('admin_auth');
		if (auth !== 'true') {
			window.location.href = '/admin';
			return;
		}
		fetchEntries();
	});
	
	async function fetchEntries() {
		try {
			loading = true;
			const response = await fetch('/api/devlog');
			if (!response.ok) throw new Error('Failed to fetch dev log entries');
			entries = await response.json();
		} catch (err) {
			error = 'Failed to load dev log entries';
		} finally {
			loading = false;
		}
	}
	
	function openForm(entry?: DevLogEntry) {
		if (entry) {
			editingEntry = entry;
			formData = {
				title: entry.title,
				content: entry.content,
				category: entry.category,
				tags: entry.tags.join(', '),
				date: entry.date
			};
		} else {
			editingEntry = null;
			formData = {
				title: '',
				content: '',
				category: 'feature',
				tags: '',
				date: new Date().toISOString().split('T')[0]
			};
		}
		showForm = true;
	}
	
	function closeForm() {
		showForm = false;
		editingEntry = null;
	}
	
	async function handleSubmit() {
		try {
			const token = sessionStorage.getItem('admin_token');
			if (!token) {
				window.location.href = '/admin';
				return;
			}
			
			const entryData = {
				...formData,
				tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
			};
			
			const url = editingEntry ? `/api/devlog/${editingEntry.id}` : '/api/devlog';
			const method = editingEntry ? 'PUT' : 'POST';
			
			const response = await fetch(url, {
				method,
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(entryData)
			});
			
			if (!response.ok) throw new Error('Failed to save entry');
			
			closeForm();
			fetchEntries();
		} catch (err) {
			error = 'Failed to save entry';
		}
	}
	
	async function deleteEntry(id: string) {
		if (!confirm('Are you sure you want to delete this entry?')) return;
		
		try {
			const token = sessionStorage.getItem('admin_token');
			if (!token) {
				window.location.href = '/admin';
				return;
			}
			
			const response = await fetch(`/api/devlog/${id}`, { 
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!response.ok) throw new Error('Failed to delete entry');
			fetchEntries();
		} catch (err) {
			error = 'Failed to delete entry';
		}
	}
	
	function getCategoryColor(category: DevLogEntry['category']) {
		switch (category) {
			case 'feature': return 'bg-[#238636]/20 text-[#7ee787]';
			case 'bug-fix': return 'bg-[#da3633]/20 text-[#ff7b72]';
			case 'learning': return 'bg-[#1f6feb]/20 text-[#79c0ff]';
			case 'update': return 'bg-[#9e6a03]/20 text-[#f2cc60]';
			default: return 'bg-[#484f58]/20 text-[#8b949e]';
		}
	}
	
	function getCategoryIcon(category: DevLogEntry['category']) {
		switch (category) {
			case 'feature': return '✨';
			case 'bug-fix': return '🐛';
			case 'learning': return '📚';
			case 'update': return '🔄';
			default: return '📄';
		}
	}
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Manage Dev Log - Admin Panel</title>
</svelte:head>

<div class="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
	<div class="container mx-auto px-4 py-8">
		<div class="flex justify-between items-center mb-8">
			<div>
				<a href="/admin" class="text-[#58a6ff] hover:underline mb-2 inline-block">← Back to Admin</a>
				<h1 class="text-3xl font-bold">Manage Dev Log</h1>
			</div>
			<button
				on:click={() => openForm()}
				class="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
			>
				Add Entry
			</button>
		</div>
		
		{#if error}
			<div class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
				{error}
			</div>
		{/if}
		
		{#if loading}
			<div class="text-center py-12">
				<div class="text-6xl mb-4">⏳</div>
				<p class="text-[#8b949e]">Loading dev log entries...</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each entries as entry}
					<div class="bg-[#21262d] border border-[#30363d] rounded-lg p-6">
						<div class="flex justify-between items-start mb-4">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<span class="px-3 py-1 text-sm rounded-full border {getCategoryColor(entry.category)}">
										{getCategoryIcon(entry.category)} {entry.category.replace('-', ' ')}
									</span>
									<span class="text-[#8b949e] text-sm">{formatDate(entry.date)}</span>
								</div>
								<h3 class="text-xl font-semibold mb-2">{entry.title}</h3>
								<p class="text-[#8b949e] mb-3">{entry.content}</p>
								
								{#if entry.tags.length > 0}
									<div class="flex flex-wrap gap-2 mb-4">
										{#each entry.tags as tag}
											<span class="px-2 py-1 bg-[#30363d] text-[#8b949e] text-xs rounded">
												{tag}
											</span>
										{/each}
									</div>
								{/if}
							</div>
							
							<div class="flex space-x-2 ml-4">
								<button
									on:click={() => openForm(entry)}
									class="px-3 py-1 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-sm rounded transition-colors"
								>
									Edit
								</button>
								<button
									on:click={() => deleteEntry(entry.id)}
									class="px-3 py-1 bg-[#da3633] hover:bg-[#f85149] text-white text-sm rounded transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
			
			{#if entries.length === 0}
				<div class="text-center py-12">
					<div class="text-6xl mb-4">📝</div>
					<h3 class="text-xl font-semibold mb-2">No dev log entries yet</h3>
					<p class="text-[#8b949e]">Add your first entry to get started!</p>
				</div>
			{/if}
		{/if}
	</div>
	
	<!-- Form Modal -->
	{#if showForm}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div class="bg-[#21262d] border border-[#30363d] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<h2 class="text-xl font-semibold mb-6">
					{editingEntry ? 'Edit Entry' : 'Add New Entry'}
				</h2>
				
				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-[#8b949e] mb-2">Title</label>
							<input
								bind:value={formData.title}
								required
								class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-[#8b949e] mb-2">Category</label>
							<select
								bind:value={formData.category}
								class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
							>
								<option value="feature">✨ Feature</option>
								<option value="bug-fix">🐛 Bug Fix</option>
								<option value="learning">📚 Learning</option>
								<option value="update">🔄 Update</option>
							</select>
						</div>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-[#8b949e] mb-2">Date</label>
						<input
							bind:value={formData.date}
							required
							type="date"
							class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
						/>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-[#8b949e] mb-2">Content</label>
						<textarea
							bind:value={formData.content}
							required
							rows="4"
							class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
						></textarea>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-[#8b949e] mb-2">Tags (comma-separated)</label>
						<input
							bind:value={formData.tags}
							placeholder="React, TypeScript, Performance"
							class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
						/>
					</div>
					
					<div class="flex space-x-3 pt-4">
						<button
							type="submit"
							class="flex-1 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
						>
							{editingEntry ? 'Update Entry' : 'Add Entry'}
						</button>
						<button
							type="button"
							on:click={closeForm}
							class="flex-1 px-4 py-2 bg-[#484f58] hover:bg-[#6e7681] text-white rounded-lg transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div> 