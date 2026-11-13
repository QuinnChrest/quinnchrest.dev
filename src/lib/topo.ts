// Contour lines: wobbly rings around a few "peaks", from a fixed seed so the
// same seed always draws the same map. Used by the page background
// (Topo.svelte) and the share images (src/lib/server/og.ts).

export type Peak = { x: number; y: number; rings: number };

export const DEFAULT_PEAKS: Peak[] = [
	{ x: 950, y: 220, rings: 16 },
	{ x: 1150, y: 640, rings: 10 },
	{ x: 60, y: 660, rings: 7 }
];

function random(s: number) {
	return () => {
		s = (s * 16807) % 2147483647;
		return s / 2147483647;
	};
}

export function contours(seed: number, peaks: Peak[] = DEFAULT_PEAKS): { d: string; index: boolean }[] {
	const rand = random(seed * 9973 + 7);
	const out: { d: string; index: boolean }[] = [];
	for (const peak of peaks) {
		const p1 = rand() * 10;
		const p2 = rand() * 10;
		for (let r = 1; r <= peak.rings; r++) {
			let d = '';
			for (let a = 0; a <= 72; a++) {
				const t = (a / 72) * Math.PI * 2;
				const rad = r * 34 * (1 + 0.18 * Math.sin(3 * t + p1) + 0.1 * Math.sin(5 * t + r * 0.3 + p2));
				const x = peak.x + Math.cos(t) * rad * 1.3;
				const y = peak.y + Math.sin(t) * rad;
				d += `${a ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
			}
			// Every fifth ring is an "index contour", drawn thicker like on real maps.
			out.push({ d: d + 'Z', index: r % 5 === 0 });
		}
	}
	return out;
}

/** Stable number from a string, used to give each page its own map. */
export function seedFrom(s: string): number {
	return [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100000, 7);
}
