import matter from 'gray-matter';
import { Marked } from 'marked';
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
	'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop';

// `breaks` keeps single line breaks, which is how older entries were written
// (they used to be shown as plain text with white-space: pre-line).
const markdown = new Marked({ gfm: true, breaks: true });

// Links in content open in a new tab when they leave the site.
markdown.use({
	renderer: {
		link({ href, title, tokens }) {
			const text = this.parser.parseInline(tokens);
			const external = /^https?:\/\//.test(href);
			const t = title ? ` title="${title}"` : '';
			return external
				? `<a href="${href}"${t} target="_blank" rel="noopener">${text}</a>`
				: `<a href="${href}"${t}>${text}</a>`;
		}
	}
});

function render(md: string): string {
	return markdown.parse(md, { async: false }) as string;
}

function fileName(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

function toPlainText(html: string): string {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\s+/g, ' ')
		.trim();
}

const AI_DISCLAIMER = /^(\*?)this post was (written|created) (using|with the help of) (generative )?ai[^\n]*\n+/i;

function excerptOf(md: string, max = 200): string {
	// Skip the AI disclaimer line so it doesn't become every summary.
	const body = md.replace(AI_DISCLAIMER, '');
	const firstParagraph = body.split(/\n\s*\n/).find((p) => p.trim()) ?? '';
	const text = toPlainText(render(firstParagraph));
	if (text.length <= max) return text;
	return text.slice(0, text.lastIndexOf(' ', max)).replace(/[,.;:]$/, '') + '…';
}

let projectsCache: Project[] | undefined;
let devlogCache: DevLogEntry[] | undefined;

export function getProjects(): Project[] {
	projectsCache ??= Object.entries(projectFiles)
		.map(([path, raw]) => {
			const { data, content } = matter(raw);
			const slug = fileName(path);
			return {
				id: String(data.id ?? slug),
				slug,
				title: data.title,
				description: content.trim(),
				html: render(content.trim()),
				image: data.image || DEFAULT_IMAGE,
				technologies: data.technologies ?? [],
				githubUrl: data.githubUrl || undefined,
				liveUrl: data.liveUrl || undefined,
				status: data.status ?? 'planned',
				featured: !!data.featured
			} satisfies Project;
		})
		.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.id) - Number(a.id));
	return projectsCache;
}

export function getDevLog(): DevLogEntry[] {
	devlogCache ??= Object.entries(devlogFiles)
		.map(([path, raw]) => {
			const { data, content } = matter(raw);
			const body = content.trim();
			const words = toPlainText(render(body)).split(' ').length;
			return {
				id: String(data.id ?? fileName(path)),
				slug: fileName(path).replace(/^\d{4}-\d{2}-\d{2}-/, ''),
				title: data.title,
				date: new Date(data.date).toISOString(),
				content: body,
				html: render(body),
				excerpt: excerptOf(body),
				readingMinutes: Math.max(1, Math.round(words / 220)),
				tags: data.tags ?? [],
				category: data.category ?? 'update',
				project: data.project || undefined
			} satisfies DevLogEntry;
		})
		.sort((a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id));

	const slugs = new Set<string>();
	for (const entry of devlogCache) {
		if (slugs.has(entry.slug)) throw new Error(`Two dev log entries share the slug "${entry.slug}"`);
		slugs.add(entry.slug);
	}
	return devlogCache;
}

export function getProject(slug: string): Project | undefined {
	return getProjects().find((p) => p.slug === slug);
}

export function getEntry(slug: string): DevLogEntry | undefined {
	return getDevLog().find((e) => e.slug === slug);
}

export function getEntriesForProject(slug: string): DevLogEntry[] {
	return getDevLog().filter((e) => e.project === slug);
}
