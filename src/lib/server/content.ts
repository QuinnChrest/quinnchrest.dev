import matter from 'gray-matter';
import type { DevLogEntry, Project } from '$lib/types';

// Content lives in src/content as Markdown files with YAML frontmatter.
// Files are bundled at build time, so adding an entry is just adding a file.
const projectFiles = import.meta.glob('/src/content/projects/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const devlogFiles = import.meta.glob('/src/content/devlog/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const DEFAULT_IMAGE =
	'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop';

function slugFromPath(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

export function getProjects(): Project[] {
	return Object.entries(projectFiles)
		.map(([path, raw]) => {
			const { data, content } = matter(raw);
			return {
				id: String(data.id ?? slugFromPath(path)),
				title: data.title,
				description: content.trim(),
				image: data.image || DEFAULT_IMAGE,
				technologies: data.technologies ?? [],
				githubUrl: data.githubUrl || undefined,
				liveUrl: data.liveUrl || undefined,
				status: data.status ?? 'planned',
				featured: !!data.featured
			} satisfies Project;
		})
		.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.id) - Number(a.id));
}

export function getDevLog(): DevLogEntry[] {
	return Object.entries(devlogFiles)
		.map(([path, raw]) => {
			const { data, content } = matter(raw);
			return {
				id: String(data.id ?? slugFromPath(path)),
				title: data.title,
				date: new Date(data.date).toISOString(),
				content: content.trim(),
				tags: data.tags ?? [],
				category: data.category ?? 'update'
			} satisfies DevLogEntry;
		})
		.sort((a, b) => b.date.localeCompare(a.date));
}
