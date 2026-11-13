import type { Note, NoteCategory, ProjectKind, ProjectStatus, TrailItem } from '$lib/types';

export const SITE_URL = 'https://quinnchrest.dev';

// Dates are stored as midnight UTC, so format in UTC to avoid showing the day before.
export function formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
	return new Date(iso).toLocaleDateString('en-US', {
		timeZone: 'UTC',
		year: 'numeric',
		month: style === 'long' ? 'long' : 'short',
		day: 'numeric'
	});
}

export const categoryLabel: Record<NoteCategory, string> = {
	feature: 'Feature',
	'bug-fix': 'Bug fix',
	learning: 'Learning',
	update: 'Update'
};

export const kindLabel: Record<ProjectKind, string> = {
	ai: 'AI',
	game: 'Game',
	web: 'Web',
	tool: 'Tool'
};

export const statusLabel: Record<ProjectStatus, string> = {
	completed: 'Shipped',
	'in-progress': 'In progress',
	planned: 'Planned'
};

export function noteToTrail(note: Note, projectTitle?: string): TrailItem {
	return {
		key: note.url,
		href: note.url,
		date: note.date,
		meta: [projectTitle, categoryLabel[note.category], `${note.readingMinutes} min`].filter(Boolean).join(' · '),
		title: note.title,
		excerpt: note.excerpt,
		pending: note.visibility === 'published' ? undefined : note.visibility
	};
}
