import type { BlogPost } from '$lib/types';
import { toPlainText } from './content';

// The blog lives on micro.blog at quinnchrest.com. Its JSON Feed is read at
// build time; the daily deploy picks up new posts. If it can't be fetched, the
// home page leaves the trail log out and the build carries on.
export const BLOG_URL = 'https://quinnchrest.com';
const FEED = `${BLOG_URL}/feed.json`;

type FeedItem = { id: string; url: string; title?: string; content_html?: string; date_published: string };

let cached: Promise<BlogPost[] | null> | undefined;

export function getBlogPosts(fetchFn: typeof fetch = fetch, count = 5): Promise<BlogPost[] | null> {
	cached ??= load(fetchFn, count);
	return cached;
}

function shorten(text: string, max = 220): string {
	if (text.length <= max) return text;
	return text.slice(0, text.lastIndexOf(' ', max)).replace(/[,.;:]$/, '') + '…';
}

async function load(fetchFn: typeof fetch, count: number): Promise<BlogPost[] | null> {
	try {
		const res = await fetchFn(FEED);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const feed: { items: FeedItem[] } = await res.json();
		return feed.items
			.sort((a, b) => b.date_published.localeCompare(a.date_published))
			.slice(0, count)
			.map((item) => {
				const html = item.content_html ?? '';
				// Only https images, so a post can't pull an insecure image into the page.
				const image = html.match(/<img[^>]+src="(https:\/\/[^"]+)"/)?.[1];
				return {
					url: item.url,
					date: item.date_published,
					title: item.title?.trim() || undefined,
					excerpt: shorten(toPlainText(html)) || (image ? 'A photo.' : ''),
					image
				};
			});
	} catch (e) {
		console.warn(`Skipping blog posts: ${e instanceof Error ? e.message : e}`);
		return null;
	}
}
