import { dev } from '$app/environment';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { PROJECT_KINDS, type DevLogEntry, type Project, type ProjectKind } from '$lib/types';

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

export function toPlainText(html: string): string {
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

function checkKind(kind: unknown, slug: string): ProjectKind | undefined {
	if (kind === undefined) return undefined;
	if (!PROJECT_KINDS.includes(kind as ProjectKind))
		throw new Error(`Project "${slug}" has kind "${kind}"; use one of: ${PROJECT_KINDS.join(', ')}`);
	return kind as ProjectKind;
}
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
				kind: checkKind(data.kind, slug),
				featured: !!data.featured
			} satisfies Project;
		})
		.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.id) - Number(a.id));
	return projectsCache;
}

/**
 * Drafts (`draft: true`) and posts dated in the future are left out of the
 * built site: no page, no RSS item, no search result. The daily scheduled
 * deploy publishes a future-dated post on the morning of its date. In
 * `npm run dev` they're included and labeled, so they can be previewed.
 */
function visibility(draft: boolean, date: string): DevLogEntry['visibility'] {
	if (draft) return 'draft';
	return date > new Date().toISOString() ? 'scheduled' : 'published';
}

export function getDevLog(): DevLogEntry[] {
	devlogCache ??= getAllDevLog().filter((e) => dev || e.visibility === 'published');
	return devlogCache;
}

let allDevlogCache: DevLogEntry[] | undefined;

function getAllDevLog(): DevLogEntry[] {
	if (allDevlogCache) return allDevlogCache;
	allDevlogCache = Object.entries(devlogFiles)
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
				project: data.project || undefined,
				visibility: visibility(!!data.draft, new Date(data.date).toISOString())
			} satisfies DevLogEntry;
		})
		.sort((a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id));

	// Checked across drafts too, so a draft can't collide when it's published.
	const slugs = new Set<string>();
	const ids = new Set<string>();
	for (const entry of allDevlogCache) {
		if (slugs.has(entry.slug)) throw new Error(`Two dev log entries share the slug "${entry.slug}"`);
		if (ids.has(entry.id)) throw new Error(`Two dev log entries share the id ${entry.id} (it's the RSS guid)`);
		slugs.add(entry.slug);
		ids.add(entry.id);
		// Catch a `project:` that points at a project file that doesn't exist.
		if (entry.project && !getProjects().some((p) => p.slug === entry.project))
			throw new Error(`Dev log entry "${entry.slug}" links to unknown project "${entry.project}"`);
	}
	return allDevlogCache;
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
