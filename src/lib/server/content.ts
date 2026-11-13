import { dev } from '$app/environment';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { PROJECT_KINDS, type Note, type Project, type ProjectKind } from '$lib/types';

// Content lives in src/content as Markdown files with YAML frontmatter.
// Files are bundled at build time, so adding an entry is just adding a file.
const projectFiles = import.meta.glob('/src/content/projects/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

// Project notes: src/content/notes/<project-slug>/<YYYY-MM-DD>-<slug>.md
const noteFiles = import.meta.glob('/src/content/notes/*/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

// Notes about this site itself: src/content/changelog/<YYYY-MM-DD>-<slug>.md
const changelogFiles = import.meta.glob('/src/content/changelog/*.md', {
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

const NAMED_ENTITIES: Record<string, string> = {
	amp: '&',
	quot: '"',
	apos: "'",
	lt: '<',
	gt: '>',
	nbsp: ' ',
	rsquo: '’',
	lsquo: '‘',
	rdquo: '”',
	ldquo: '“',
	hellip: '…',
	mdash: '—',
	ndash: '–'
};

/** Strips tags and decodes entities, so text can be shown (and escaped) as plain text. */
export function toPlainText(html: string): string {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
		.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
		.replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m)
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
 * Drafts (`draft: true`) and notes dated in the future are left out of the
 * built site: no page, no search result, no share image. The daily scheduled
 * deploy publishes a future-dated note on the morning of its date. In
 * `npm run dev` they're included and labeled, so they can be previewed.
 */
function visibility(draft: boolean, date: string): Note['visibility'] {
	if (draft) return 'draft';
	return date > new Date().toISOString() ? 'scheduled' : 'published';
}

function parseNote(path: string, raw: string, project?: string): Note {
	const { data, content } = matter(raw);
	const body = content.trim();
	const slug = fileName(path).replace(/^\d{4}-\d{2}-\d{2}-/, '');
	const date = new Date(data.date ?? fileName(path).slice(0, 10)).toISOString();
	const words = toPlainText(render(body)).split(' ').length;
	if (!data.title) throw new Error(`${path} needs a title`);
	return {
		slug,
		project,
		url: project ? `/projects/${project}/${slug}` : `/changelog/${slug}`,
		ogImage: `/og/${project ?? 'changelog'}/${slug}.png`,
		date,
		title: data.title,
		content: body,
		html: render(body),
		excerpt: excerptOf(body),
		readingMinutes: Math.max(1, Math.round(words / 220)),
		tags: data.tags ?? [],
		category: data.category ?? 'update',
		visibility: visibility(!!data.draft, date)
	};
}

const newestFirst = (a: Note, b: Note) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);
const shown = (n: Note) => dev || n.visibility === 'published';

let allNotesCache: Note[] | undefined;

function allNotes(): Note[] {
	if (allNotesCache) return allNotesCache;
	const projects = new Set(getProjects().map((p) => p.slug));
	if (projects.has('changelog')) throw new Error('"changelog" is reserved and can\'t be a project slug');
	const notes = Object.entries(noteFiles).map(([path, raw]) => {
		const project = path.split('/').at(-2)!;
		if (!projects.has(project))
			throw new Error(`${path} is in a folder with no matching project file (src/content/projects/${project}.md)`);
		return parseNote(path, raw, project);
	});
	const changelog = Object.entries(changelogFiles).map(([path, raw]) => parseNote(path, raw));
	allNotesCache = [...notes, ...changelog].sort(newestFirst);

	// Checked across drafts too, so a draft can't collide when it's published.
	const urls = new Set<string>();
	for (const n of allNotesCache) {
		if (urls.has(n.url)) throw new Error(`Two notes would both be published at ${n.url}`);
		urls.add(n.url);
	}
	return allNotesCache;
}

/** All project notes, newest first (not changelog notes). */
export function getNotes(): Note[] {
	return allNotes().filter((n) => n.project && shown(n));
}

export function getNotesForProject(project: string): Note[] {
	return allNotes().filter((n) => n.project === project && shown(n));
}

/** Notes about this site, newest first. */
export function getChangelog(): Note[] {
	return allNotes().filter((n) => !n.project && shown(n));
}

/** Every note the site publishes: project notes and changelog. */
export function getAllPublishedNotes(): Note[] {
	return allNotes().filter(shown);
}

export function getProject(slug: string): Project | undefined {
	return getProjects().find((p) => p.slug === slug);
}
