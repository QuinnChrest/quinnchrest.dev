export type ProjectStatus = 'completed' | 'in-progress' | 'planned';
export type DevLogCategory = 'feature' | 'bug-fix' | 'learning' | 'update';

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
	featured: boolean;
}

export interface DevLogEntry {
	id: string;
	/** From the file name without the date: 2026-11-12-meet-hey-leo.md → /log/meet-hey-leo */
	slug: string;
	date: string;
	title: string;
	/** Raw Markdown body */
	content: string;
	/** Rendered HTML of the body */
	html: string;
	/** Plain-text summary for cards, meta descriptions and the RSS feed */
	excerpt: string;
	readingMinutes: number;
	tags: string[];
	category: DevLogCategory;
	/** Slug of the project this entry is about, if any */
	project?: string;
}

export interface GitHubStats {
	publicRepos: number;
	followers: number;
	stars: number;
	forks: number;
	topRepos: { name: string; url: string; description: string | null; stars: number; forks: number }[];
}

export interface SearchDoc {
	type: 'project' | 'entry';
	url: string;
	title: string;
	/** Short line under the title: date for entries, status and stack for projects */
	meta: string;
	tags: string[];
	text: string;
}
