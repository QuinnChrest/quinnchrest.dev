import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getAllPublishedNotes, getProjects, toPlainText } from '$lib/server/content';
import { formatDate, statusLabel } from '$lib/format';
import type { SearchDoc } from '$lib/types';

export const prerender = true;

// The whole site's searchable text, built once. It's small (a few KB per note),
// and the search dialog only downloads it the first time someone opens search.
export const GET: RequestHandler = () => {
	const projects = getProjects();
	const titles = Object.fromEntries(projects.map((p) => [p.slug, p.title]));
	const docs: SearchDoc[] = [
		...projects.map((p) => ({
			type: 'project' as const,
			url: `/projects/${p.slug}`,
			title: p.title,
			meta: `${statusLabel[p.status]} · ${p.technologies.join(', ')}`,
			tags: p.technologies,
			text: toPlainText(p.html)
		})),
		...getAllPublishedNotes().map((n) => ({
			type: n.project ? ('note' as const) : ('changelog' as const),
			url: n.url,
			title: n.title,
			meta: `${n.project ? titles[n.project] : 'Changelog'} · ${formatDate(n.date, 'short')}`,
			tags: n.tags,
			text: toPlainText(n.html).replace(/^this post was (written|created)[^.]*\.\s*/i, '')
		}))
	];
	return json(docs);
};
