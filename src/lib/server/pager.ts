import type { Note } from '$lib/types';

/** Older/newer links within a newest-first list of notes. */
export function pager(list: Note[], note: Note) {
	const i = list.findIndex((n) => n.url === note.url);
	const link = (n?: Note) => (n ? { url: n.url, title: n.title } : null);
	return { newer: link(list[i - 1]), older: link(list[i + 1]) };
}
