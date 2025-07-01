<script lang="ts">
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
	
	let projects: Project[] = [
		{
			id: '1',
			title: 'Portfolio Website',
			description: 'A modern portfolio website built with SvelteKit and Tailwind CSS. Features include a dev log, projects showcase, and blog section with smooth animations and responsive design.',
			image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
			technologies: ['SvelteKit', 'TypeScript', 'Tailwind CSS'],
			githubUrl: 'https://github.com/quinnchrest/portfolio',
			liveUrl: 'https://quinnchrest.dev',
			status: 'completed',
			featured: true
		},
		{
			id: '2',
			title: 'Task Management App',
			description: 'A full-stack task management application with real-time updates, user authentication, and collaborative features. Built with React, Node.js, and PostgreSQL.',
			image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
			technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
			githubUrl: 'https://github.com/quinnchrest/task-app',
			status: 'in-progress',
			featured: true
		},
		{
			id: '3',
			title: 'Weather Dashboard',
			description: 'A weather dashboard that displays current conditions and forecasts using multiple weather APIs. Features interactive maps and customizable widgets.',
			image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop',
			technologies: ['Vue.js', 'OpenWeather API', 'Chart.js'],
			githubUrl: 'https://github.com/quinnchrest/weather-dashboard',
			liveUrl: 'https://weather.quinnchrest.dev',
			status: 'completed',
			featured: false
		},
		{
			id: '4',
			title: 'AI Chat Assistant',
			description: 'An AI-powered chat assistant that helps with coding questions and provides real-time suggestions. Integrates with OpenAI API and supports multiple programming languages.',
			image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
			technologies: ['Python', 'OpenAI API', 'FastAPI', 'React'],
			status: 'planned',
			featured: false
		}
	];
	
	let selectedFilter = 'all';
	
	$: filteredProjects = projects.filter(project => {
		if (selectedFilter === 'all') return true;
		if (selectedFilter === 'featured') return project.featured;
		return project.status === selectedFilter;
	});
	
	function getStatusColor(status: Project['status']) {
		switch (status) {
			case 'completed': return 'bg-[#238636]/20 text-[#7ee787] border-[#238636]/30';
			case 'in-progress': return 'bg-[#9e6a03]/20 text-[#f2cc60] border-[#9e6a03]/30';
			case 'planned': return 'bg-[#1f6feb]/20 text-[#79c0ff] border-[#1f6feb]/30';
			default: return 'bg-[#484f58]/20 text-[#8b949e] border-[#484f58]/30';
		}
	}
	
	function getStatusIcon(status: Project['status']) {
		switch (status) {
			case 'completed': return '✅';
			case 'in-progress': return '🚧';
			case 'planned': return '📋';
			default: return '📄';
		}
	}
</script>

<div class="space-y-6">
	<!-- Controls -->
	<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
		<!-- Filter -->
		<div class="flex items-center space-x-4">
			<label class="text-sm font-medium text-[#8b949e]">Filter:</label>
			<select
				bind:value={selectedFilter}
				class="px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff]"
			>
				<option value="all">All Projects</option>
				<option value="featured">Featured</option>
				<option value="completed">Completed</option>
				<option value="in-progress">In Progress</option>
				<option value="planned">Planned</option>
			</select>
		</div>
	</div>
	
	<!-- Projects Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredProjects as project}
			<div class="group bg-[#21262d] border border-[#30363d] rounded-lg overflow-hidden hover:bg-[#30363d] transition-all duration-300 transform hover:scale-105">
				<!-- Project Image -->
				<div class="relative h-48 overflow-hidden">
					<img
						src={project.image}
						alt={project.title}
						class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
					
					<!-- Status Badge -->
					<div class="absolute top-4 right-4">
						<span class="inline-block px-3 py-1 text-xs font-medium rounded-full border {getStatusColor(project.status)}">
							{getStatusIcon(project.status)} {project.status.replace('-', ' ')}
						</span>
					</div>
					
					<!-- Featured Badge -->
					{#if project.featured}
						<div class="absolute top-4 left-4">
							<span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#9e6a03]/20 text-[#f2cc60] border border-[#9e6a03]/30">
								⭐ Featured
							</span>
						</div>
					{/if}
				</div>
				
				<!-- Project Content -->
				<div class="p-6">
					<h3 class="text-xl font-semibold text-[#f0f6fc] mb-3 group-hover:text-[#58a6ff] transition-colors">
						{project.title}
					</h3>
					
					<p class="text-[#8b949e] text-sm leading-relaxed mb-4">
						{project.description}
					</p>
					
					<!-- Technologies -->
					<div class="flex flex-wrap gap-2 mb-4">
						{#each project.technologies as tech}
							<span class="px-2 py-1 bg-[#30363d] text-[#8b949e] text-xs rounded-md">
								{tech}
							</span>
						{/each}
					</div>
					
					<!-- Action Buttons -->
					<div class="flex space-x-3">
						{#if project.githubUrl}
							<a
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex-1 px-4 py-2 bg-[#30363d] hover:bg-[#484f58] text-[#f0f6fc] text-sm font-medium rounded-lg transition-colors text-center"
							>
								GitHub
							</a>
						{/if}
						{#if project.liveUrl}
							<a
								href={project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="flex-1 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium rounded-lg transition-colors text-center"
							>
								Live Demo
							</a>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
	
	<!-- Empty State -->
	{#if filteredProjects.length === 0}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">🚀</div>
			<h3 class="text-xl font-semibold text-[#f0f6fc] mb-2">No projects found</h3>
			<p class="text-[#8b949e]">Try changing the filter to see more projects!</p>
		</div>
	{/if}
</div> 