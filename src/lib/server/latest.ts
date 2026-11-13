import { getNotes } from './content';

export type LatestNote = { title: string; date: string; count: number };

/** For each project with notes: its newest note and how many it has. */
export function latestNotes(): Record<string, LatestNote> {
	const out: Record<string, LatestNote> = {};
	for (const n of getNotes()) {
		const p = n.project!;
		// getNotes() is newest first, so the first one seen is the latest.
		if (out[p]) out[p].count++;
		else out[p] = { title: n.title, date: n.date, count: 1 };
	}
	return out;
}
