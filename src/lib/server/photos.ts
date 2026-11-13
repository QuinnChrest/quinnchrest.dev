import type { Photo } from '$lib/types';

// The photo list lives in the photos site's repo (it's bundled into that site,
// not published as its own file), so read it from GitHub at build time. The
// daily deploy picks up new photos. If it can't be fetched, the home page just
// leaves the strip out and the build carries on.
const SOURCE = 'https://raw.githubusercontent.com/QuinnChrest/photos.quinnchrest.dev/main/src/data/photos.json';
export const PHOTOS_URL = 'https://photos.quinnchrest.dev';

type Raw = {
	id: string;
	width: number;
	height: number;
	widths: number[];
	title?: string;
	caption?: string;
	exif?: { takenAt?: string };
};

let cached: Promise<Photo[] | null> | undefined;

export function getRecentPhotos(fetchFn: typeof fetch = fetch, count = 6): Promise<Photo[] | null> {
	cached ??= load(fetchFn, count);
	return cached;
}

async function load(fetchFn: typeof fetch, count: number): Promise<Photo[] | null> {
	try {
		const res = await fetchFn(SOURCE);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const raw: Raw[] = await res.json();
		return (
			raw
				.map((p, i) => ({ p, i }))
				// Newest taken first; photos without a date keep their file order, after dated ones.
				.sort((a, b) => (b.p.exif?.takenAt ?? '').localeCompare(a.p.exif?.takenAt ?? '') || a.i - b.i)
				.slice(0, count)
				.map(({ p }) => {
					const w = p.widths.includes(640) ? 640 : Math.min(...p.widths);
					const base = `${PHOTOS_URL}/img/${p.id}/${w}`;
					return {
						id: p.id,
						url: `${PHOTOS_URL}/#/p/${encodeURIComponent(p.id)}`,
						avif: `${base}.avif`,
						webp: `${base}.webp`,
						jpg: `${base}.jpg`,
						width: p.width,
						height: p.height,
						alt: p.title || p.caption || 'A photo by Quinn Chrest',
						takenAt: p.exif?.takenAt
					};
				})
		);
	} catch (e) {
		console.warn(`Skipping recent photos: ${e instanceof Error ? e.message : e}`);
		return null;
	}
}
