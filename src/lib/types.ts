export type ProjectStatus = 'completed' | 'in-progress' | 'planned';

/** Hand-picked project type, used for labels and the projects page filter. */
export const PROJECT_KINDS = ['ai', 'game', 'web', 'tool'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];
export type NoteCategory = 'feature' | 'bug-fix' | 'learning' | 'update';

export interface Project {
	id: string;
	/** From the file name: src/content/projects/<slug>.md → /projects/<slug> */
	slug: string;
	title: string;
	/** Raw Markdown body */
	description: string;
	/** Rendered HTML of the body */
	html: string;
	image: string;
	technologies: string[];
	githubUrl?: string;
	liveUrl?: string;
	status: ProjectStatus;
	kind?: ProjectKind;
	featured: boolean;
}

/**
 * A note about a project (src/content/notes/<project>/<date>-<slug>.md,
 * published at /projects/<project>/<slug>) or about this site
 * (src/content/changelog/<date>-<slug>.md, published at /changelog/<slug>).
 */
export interface Note {
	/** From the file name without the date */
	slug: string;
	/** Project slug from the folder name; undefined for changelog notes */
	project?: string;
	/** Page address, e.g. /projects/hey-leo/meet-hey-leo or /changelog/postgresql-backups */
	url: string;
	/** Share image address */
	ogImage: string;
	date: string;
	title: string;
	/** Raw Markdown body */
	content: string;
	/** Rendered HTML of the body */
	html: string;
	/** Plain-text summary for cards and meta descriptions */
	excerpt: string;
	readingMinutes: number;
	tags: string[];
	category: NoteCategory;
	/** Only 'published' notes are in the built site; the others show up in `npm run dev`. */
	visibility: 'published' | 'draft' | 'scheduled';
}

/** A post from the micro.blog blog at quinnchrest.com, read at build time. */
export interface BlogPost {
	url: string;
	date: string;
	/** Most micro.blog posts have no title */
	title?: string;
	excerpt: string;
	image?: string;
}

/** One stop on a Trail: a note or a blog post. */
export interface TrailItem {
	key: string;
	href: string;
	date: string;
	/** Second line under the date, e.g. "Feature · 2 min" */
	meta: string;
	title?: string;
	excerpt: string;
	image?: string;
	external?: boolean;
	pending?: 'draft' | 'scheduled';
}

export interface GitHubStats {
	publicRepos: number;
	followers: number;
	stars: number;
	forks: number;
	topRepos: { name: string; url: string; description: string | null; stars: number; forks: number }[];
}

export interface SearchDoc {
	type: 'project' | 'note' | 'changelog';
	url: string;
	title: string;
	/** Short line under the title: project and date for notes, status and stack for projects */
	meta: string;
	tags: string[];
	text: string;
}

export interface Photo {
	id: string;
	/** Opens this photo on photos.quinnchrest.dev */
	url: string;
	avif: string;
	webp: string;
	jpg: string;
	/** Bigger copies (about 1280px wide) for the on-page viewer */
	large: { avif: string; webp: string; jpg: string };
	width: number;
	height: number;
	alt: string;
	takenAt?: string;
}
