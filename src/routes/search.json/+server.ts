import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getDevLog, getProjects, toPlainText } from '$lib/server/content';
import { formatDate, statusLabel } from '$lib/format';
import type { SearchDoc } from '$lib/types';

export const prerender = true;

// The whole site's searchable text, built once. It's small (a few KB per post),
// and the search dialog only downloads it the first time someone opens search.
export const GET: RequestHandler = () => {
	const docs: SearchDoc[] = [
		...getProjects().map((p) => ({
			type: 'project' as const,
			url: `/projects/${p.slug}`,
			title: p.title,
			meta: `${statusLabel[p.status]} · ${p.technologies.join(', ')}`,
			tags: p.technologies,
			text: toPlainText(p.html)
		})),
		...getDevLog().map((e) => ({
			type: 'entry' as const,
			url: `/log/${e.slug}`,
			title: e.title,
			meta: formatDate(e.date, 'short'),
			tags: e.tags,
			text: toPlainText(e.html).replace(/^this post was (written|created)[^.]*\.\s*/i, '')
		}))
	];
	return json(docs);
};
