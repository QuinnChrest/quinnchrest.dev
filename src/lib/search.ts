import type { SearchDoc } from '$lib/types';

export interface SearchHit {
	doc: SearchDoc;
	score: number;
	/** Text around the first match, split so the matched part can be highlighted */
	snippet: { before: string; match: string; after: string } | null;
}

const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '');

/**
 * Small, dependency-free search: every word in the query must appear somewhere
 * in the doc. Matches in the title count most, then tags, then the body; a match
 * at the start of a word beats one in the middle.
 */
export function search(docs: SearchDoc[], query: string, limit = 12): SearchHit[] {
	const terms = norm(query).split(/\s+/).filter(Boolean);
	if (!terms.length) return [];

	const hits: SearchHit[] = [];
	for (const doc of docs) {
		const title = norm(doc.title);
		const tags = norm(doc.tags.join(' '));
		const text = norm(doc.text);
		let score = 0;
		let ok = true;
		for (const t of terms) {
			const wordStart = new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
			const s =
				(title.includes(t) ? (wordStart.test(title) ? 12 : 6) : 0) +
				(tags.includes(t) ? (wordStart.test(tags) ? 6 : 3) : 0) +
				(text.includes(t) ? (wordStart.test(text) ? 2 : 1) + Math.min(3, text.split(t).length - 2) * 0.3 : 0);
			if (!s) {
				ok = false;
				break;
			}
			score += s;
		}
		if (ok) hits.push({ doc, score, snippet: snippetFor(doc.text, text, terms) });
	}
	return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

function snippetFor(original: string, normalized: string, terms: string[]): SearchHit['snippet'] {
	// Normalizing only removes accents, so indexes line up with the original text.
	let at = -1;
	let len = 0;
	for (const t of terms) {
		const i = normalized.indexOf(t);
		if (i !== -1 && (at === -1 || i < at)) {
			at = i;
			len = t.length;
		}
	}
	if (at === -1) return null;
	const start = Math.max(0, original.lastIndexOf(' ', Math.max(0, at - 60)) + 1);
	const endSpace = original.indexOf(' ', at + len + 90);
	const end = endSpace === -1 ? original.length : endSpace;
	return {
		before: (start > 0 ? '…' : '') + original.slice(start, at),
		match: original.slice(at, at + len),
		after: original.slice(at + len, end) + (end < original.length ? '…' : '')
	};
}
