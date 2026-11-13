// Contour lines for the map background (Topo.svelte) and share images
// (src/lib/server/og.ts).
//
// Like a real topographic map, the lines are traced from ONE height field:
// a few hills summed together, so each line is a single elevation and lines
// can never cross. Neighboring hills merge into ridges and saddles. A fixed
// seed always draws the same map.

export type Peak = { x: number; y: number; rings: number };
export type ContourLine = {
	d: string;
	/** Every fifth elevation is an "index contour", drawn thicker like on real maps. */
	index: boolean;
	/** 1 for the highest elevation, counting down; used to draw the map in from the peaks. */
	ring: number;
};

/** `rings` is the hill's height: about one contour line per ring. */
export const DEFAULT_PEAKS: Peak[] = [
	{ x: 950, y: 220, rings: 16 },
	{ x: 1150, y: 640, rings: 10 },
	{ x: 60, y: 660, rings: 7 }
];

const WIDTH = 1200;
/** Grid spacing in px. Lines are interpolated between grid points and smoothed. */
const STEP = 8;

function random(s: number) {
	return () => {
		s = (s * 16807) % 2147483647;
		return s / 2147483647;
	};
}

const cache = new Map<string, ContourLine[]>();

export function contours(seed: number, peaks: Peak[] = DEFAULT_PEAKS, height = 760): ContourLine[] {
	const cacheKey = JSON.stringify([seed, peaks, height]);
	const hit = cache.get(cacheKey);
	if (hit) return hit;

	const rand = random(seed * 9973 + 7);
	const phase = Array.from({ length: 4 }, () => rand() * Math.PI * 2);

	// Height field. Each hill is a cone (so lines are evenly spaced, like a
	// steady slope) with a rounded top and a soft base (softplus), so where
	// hills meet the lines bend smoothly instead of kinking. A shared warp of
	// the coordinates makes the shapes organic; it bends every line the same
	// way, so it can't make them cross.
	const field = (x: number, y: number) => {
		const wx = x + 28 * Math.sin(y / 95 + phase[0]) + 14 * Math.sin((x + y) / 55 + phase[1]);
		const wy = y + 24 * Math.sin(x / 110 + phase[2]) + 12 * Math.sin((x - y) / 65 + phase[3]);
		let h = 0;
		for (const p of peaks) {
			const r = p.rings * 34;
			const dx = (wx - p.x) / 1.3;
			const dy = wy - p.y;
			const d = Math.sqrt(dx * dx + dy * dy + (0.12 * r) ** 2);
			h += (p.rings * Math.log1p(Math.exp(6 * (1 - d / r)))) / 6;
		}
		return h;
	};

	const cols = Math.ceil(WIDTH / STEP) + 1;
	const rows = Math.ceil(height / STEP) + 1;
	const grid = new Float64Array(cols * rows);
	let max = 0;
	for (let j = 0; j < rows; j++)
		for (let i = 0; i < cols; i++) {
			const v = field(i * STEP, j * STEP);
			grid[j * cols + i] = v;
			if (v > max) max = v;
		}

	const levels: number[] = [];
	for (let level = 1; level < max; level++) levels.push(level);

	const out: ContourLine[] = [];
	levels.forEach((level, k) => {
		for (const line of join(trace(grid, cols, rows, level))) {
			if (line.length < 4) continue;
			const d = toPath(smooth(line));
			out.push({ d, index: (k + 1) % 5 === 0, ring: levels.length - k });
		}
	});
	cache.set(cacheKey, out);
	return out;
}

type Pt = [number, number];

/** Marching squares: line segments where the field crosses `level`. */
function trace(g: Float64Array, cols: number, rows: number, level: number): [Pt, Pt][] {
	const segs: [Pt, Pt][] = [];
	const at = (i0: number, j0: number, i1: number, j1: number): Pt => {
		const a = g[j0 * cols + i0];
		const t = (level - a) / (g[j1 * cols + i1] - a);
		return [(i0 + (i1 - i0) * t) * STEP, (j0 + (j1 - j0) * t) * STEP];
	};
	for (let j = 0; j < rows - 1; j++)
		for (let i = 0; i < cols - 1; i++) {
			const tl = g[j * cols + i];
			const tr = g[j * cols + i + 1];
			const br = g[(j + 1) * cols + i + 1];
			const bl = g[(j + 1) * cols + i];
			const c = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0) | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
			if (c === 0 || c === 15) continue;
			const top = () => at(i, j, i + 1, j);
			const right = () => at(i + 1, j, i + 1, j + 1);
			const bottom = () => at(i, j + 1, i + 1, j + 1);
			const left = () => at(i, j, i, j + 1);
			// Saddle cells (5, 10) are resolved by the cell's average height.
			const high = (tl + tr + br + bl) / 4 >= level;
			switch (c) {
				case 1:
				case 14:
					segs.push([left(), bottom()]);
					break;
				case 2:
				case 13:
					segs.push([bottom(), right()]);
					break;
				case 3:
				case 12:
					segs.push([left(), right()]);
					break;
				case 4:
				case 11:
					segs.push([top(), right()]);
					break;
				case 6:
				case 9:
					segs.push([top(), bottom()]);
					break;
				case 7:
				case 8:
					segs.push([left(), top()]);
					break;
				case 5:
					if (high) segs.push([left(), top()], [bottom(), right()]);
					else segs.push([left(), bottom()], [top(), right()]);
					break;
				case 10:
					if (high) segs.push([top(), right()], [left(), bottom()]);
					else segs.push([left(), top()], [bottom(), right()]);
					break;
			}
		}
	return segs;
}

const ptKey = (p: Pt) => `${Math.round(p[0] * 100)},${Math.round(p[1] * 100)}`;

/** Chains touching segments into whole lines, so each can be drawn (and animated) as one path. */
function join(segs: [Pt, Pt][]): Pt[][] {
	const ends = new Map<string, number[]>();
	const add = (k: string, n: number) => {
		const list = ends.get(k);
		if (list) list.push(n);
		else ends.set(k, [n]);
	};
	segs.forEach((s, n) => {
		add(ptKey(s[0]), n);
		add(ptKey(s[1]), n);
	});
	const used = new Uint8Array(segs.length);
	const extend = (line: Pt[], atEnd: boolean) => {
		for (;;) {
			const tip = atEnd ? line[line.length - 1] : line[0];
			const tipKey = ptKey(tip);
			const next = ends.get(tipKey)?.find((n) => !used[n]);
			if (next === undefined) return;
			used[next] = 1;
			const [a, b] = segs[next];
			const other = ptKey(a) === tipKey ? b : a;
			if (atEnd) line.push(other);
			else line.unshift(other);
		}
	};
	const lines: Pt[][] = [];
	segs.forEach((s, n) => {
		if (used[n]) return;
		used[n] = 1;
		const line: Pt[] = [s[0], s[1]];
		extend(line, true);
		extend(line, false);
		lines.push(line);
	});
	return lines;
}

/** One pass of Chaikin smoothing; open lines keep their end points (at the canvas edge). */
function smooth(p: Pt[]): Pt[] {
	const closed = ptKey(p[0]) === ptKey(p[p.length - 1]);
	const out: Pt[] = closed ? [] : [p[0]];
	for (let i = 0; i < p.length - 1; i++) {
		const [a, b] = [p[i], p[i + 1]];
		out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
	}
	out.push(closed ? out[0] : p[p.length - 1]);
	return out;
}

/**
 * SVG path data with whole-pixel coordinates, skipping points that round to
 * the same spot as the previous one. Keeps the page small; the difference
 * isn't visible at these sizes.
 */
function toPath(points: Pt[]): string {
	let d = '';
	let last = '';
	for (const p of points) {
		const xy = `${Math.round(p[0])} ${Math.round(p[1])}`;
		if (xy === last) continue;
		d += (d ? 'L' : 'M') + xy;
		last = xy;
	}
	return d;
}

/** Stable number from a string, used to give each page its own map. */
export function seedFrom(s: string): number {
	return [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100000, 7);
}
