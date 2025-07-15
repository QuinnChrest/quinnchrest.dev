<script lang="ts">
	import { onMount } from 'svelte';
	
	interface Project {
		id: string;
		title: string;
		description: string;
		image: string;
		technologies: string[];
		githubUrl?: string;
		liveUrl?: string;
		status: 'completed' | 'in-progress' | 'planned';
		featured: boolean;
	}
	
	let projects: Project[] = [];
	let loading = true;
	let error = '';
	let showForm = false;
	let editingProject: Project | null = null;
	
	// Form data
	let formData = {
		title: '',
		description: '',
		image: '',
		technologies: '',
		githubUrl: '',
		liveUrl: '',
		status: 'completed' as Project['status'],
		featured: false
	};
	
	onMount(() => {
		// Check authentication
		const auth = sessionStorage.getItem('admin_auth');
		if (auth !== 'true') {
			window.location.href = '/admin';
			return;
		}
		fetchProjects();
	});
	
	async function fetchProjects() {
		try {
			loading = true;
			const response = await fetch('/api/projects');
			if (!response.ok) throw new Error('Failed to fetch projects');
			projects = await response.json();
		} catch (err) {
			error = 'Failed to load projects';
		} finally {
			loading = false;
		}
	}
	
	function openForm(project?: Project) {
		if (project) {
			editingProject = project;
			formData = {
				title: project.title,
				description: project.description,
				image: project.image,
				technologies: project.technologies.join(', '),
				githubUrl: project.githubUrl || '',
				liveUrl: project.liveUrl || '',
				status: project.status,
				featured: project.featured
			};
		} else {
			editingProject = null;
			formData = {
				title: '',
				description: '',
				image: '',
				technologies: '',
				githubUrl: '',
				liveUrl: '',
				status: 'completed',
				featured: false
			};
		}
		showForm = true;
	}
	
	function closeForm() {
		showForm = false;
		editingProject = null;
	}
	
	async function handleSubmit() {
		try {
			const token = sessionStorage.getItem('admin_token');
			if (!token) {
				window.location.href = '/admin';
				return;
			}
			
			const projectData = {
				...formData,
				technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t)
			};
			
			const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
			const method = editingProject ? 'PUT' : 'POST';
			
			const response = await fetch(url, {
				method,
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(projectData)
			});
			
			if (!response.ok) throw new Error('Failed to save project');
			
			closeForm();
			fetchProjects();
		} catch (err) {
			error = 'Failed to save project';
		}
	}
	
	async function deleteProject(id: string) {
		if (!confirm('Are you sure you want to delete this project?')) return;
		
		try {
			const token = sessionStorage.getItem('admin_token');
			if (!token) {
				window.location.href = '/admin';
				return;
			}
			
			const response = await fetch(`/api/projects/${id}`, { 
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!response.ok) throw new Error('Failed to delete project');
			fetchProjects();
		} catch (err) {
			error = 'Failed to delete project';
		}
	}
	
	function getStatusColor(status: Project['status']) {
		switch (status) {
			case 'completed': return 'bg-[#238636]/20 text-[#7ee787]';
			case 'in-progress': return 'bg-[#9e6a03]/20 text-[#f2cc60]';
			case 'planned': return 'bg-[#1f6feb]/20 text-[#79c0ff]';
			default: return 'bg-[#484f58]/20 text-[#8b949e]';
		}
	}
</script>

<svelte:head>
	<title>Manage Projects - Admin Panel</title>
</svelte:head>

<div class="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
	<div class="container mx-auto px-4 py-8">
		<div class="flex justify-between items-center mb-8">
			<div>
				<a href="/admin" class="text-[#58a6ff] hover:underline mb-2 inline-block">← Back to Admin</a>
				<h1 class="text-3xl font-bold">Manage Projects</h1>
			</div>
			<button
				on:click={() => openForm()}
				class="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
			>
				Add Project
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
				<p class="text-[#8b949e]">Loading projects...</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each projects as project}
					<div class="bg-[#21262d] border border-[#30363d] rounded-lg overflow-hidden">
						<div class="relative h-32">
							<img
								src={project.image}
								alt={project.title}
								class="w-full h-full object-cover"
							/>
							<div class="absolute top-2 right-2">
								<span class="px-2 py-1 text-xs rounded-full {getStatusColor(project.status)}">
									{project.status}
								</span>
							</div>
							{#if project.featured}
								<div class="absolute top-2 left-2">
									<span class="px-2 py-1 text-xs rounded-full bg-[#9e6a03]/20 text-[#f2cc60]">
										⭐ Featured
									</span>
								</div>
							{/if}
						</div>
						
						<div class="p-4">
							<h3 class="font-semibold mb-2">{project.title}</h3>
							<p class="text-[#8b949e] text-sm mb-3 line-clamp-2">{project.description}</p>
							
							<div class="flex flex-wrap gap-1 mb-4">
								{#each project.technologies.slice(0, 3) as tech}
									<span class="px-2 py-1 bg-[#30363d] text-[#8b949e] text-xs rounded">
										{tech}
									</span>
								{/each}
								{#if project.technologies.length > 3}
									<span class="px-2 py-1 bg-[#30363d] text-[#8b949e] text-xs rounded">
										+{project.technologies.length - 3}
									</span>
								{/if}
							</div>
							
							<div class="flex space-x-2">
								<button
									on:click={() => openForm(project)}
									class="flex-1 px-3 py-1 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-sm rounded transition-colors"
								>
									Edit
								</button>
								<button
									on:click={() => deleteProject(project.id)}
									class="flex-1 px-3 py-1 bg-[#da3633] hover:bg-[#f85149] text-white text-sm rounded transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
			
			{#if projects.length === 0}
				<div class="text-center py-12">
					<div class="text-6xl mb-4">🚀</div>
					<h3 class="text-xl font-semibold mb-2">No projects yet</h3>
					<p class="text-[#8b949e]">Add your first project to get started!</p>
				</div>
			{/if}
		{/if}
	</div>
	
	<!-- Form Modal -->
	{#if showForm}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div class="bg-[#21262d] border border-[#30363d] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<h2 class="text-xl font-semibold mb-6">
					{editingProject ? 'Edit Project' : 'Add New Project'}
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
							<label class="block text-sm font-medium text-[#8b949e] mb-2">Status</label>
							<select
								bind:value={formData.status}
								class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
							>
								<option value="completed">Completed</option>
								<option value="in-progress">In Progress</option>
								<option value="planned">Planned</option>
							</select>
						</div>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-[#8b949e] mb-2">Description</label>
						<textarea
							bind:value={formData.description}
							required
							rows="3"
							class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
						></textarea>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-[#8b949e] mb-2">Image URL</label>
						<input
							bind:value={formData.image}
							required
							type="url"
							class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
						/>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-[#8b949e] mb-2">Technologies (comma-separated)</label>
						<input
							bind:value={formData.technologies}
							required
							placeholder="React, TypeScript, Tailwind CSS"
							class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
						/>
					</div>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-[#8b949e] mb-2">GitHub URL</label>
							<input
								bind:value={formData.githubUrl}
								type="url"
								class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-[#8b949e] mb-2">Live Demo URL</label>
							<input
								bind:value={formData.liveUrl}
								type="url"
								class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
							/>
						</div>
					</div>
					
					<div class="flex items-center">
						<input
							bind:checked={formData.featured}
							type="checkbox"
							id="featured"
							class="mr-2"
						/>
						<label for="featured" class="text-sm text-[#8b949e]">Featured Project</label>
					</div>
					
					<div class="flex space-x-3 pt-4">
						<button
							type="submit"
							class="flex-1 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
						>
							{editingProject ? 'Update Project' : 'Add Project'}
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