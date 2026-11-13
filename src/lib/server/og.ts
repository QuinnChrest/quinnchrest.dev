import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { contours, seedFrom } from '$lib/topo';

// Share images (Open Graph cards) are drawn at build time: satori lays out the
// card as SVG, resvg turns it into a PNG. Fonts and the avatar are read from
// the repo, so nothing is fetched from the network.

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const C = { bg: '#141a15', ink: '#e9e4d4', muted: '#9aa392', contour: '#26322a', trail: '#ff7448', line: '#2c372d' };

const root = process.cwd();
const font = (pkg: string, file: string) => readFileSync(join(root, 'node_modules/@fontsource', pkg, 'files', file));

let assets: { fonts: Parameters<typeof satori>[1]['fonts']; avatar: string } | undefined;
function load() {
	assets ??= {
		fonts: [
			{ name: 'Bricolage', data: font('bricolage-grotesque', 'bricolage-grotesque-latin-400-normal.woff'), weight: 400 },
			{ name: 'Bricolage', data: font('bricolage-grotesque', 'bricolage-grotesque-latin-800-normal.woff'), weight: 800 },
			{ name: 'Plex Mono', data: font('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff'), weight: 500 }
		],
		avatar: `data:image/jpeg;base64,${readFileSync(join(root, 'static/avatar.jpg')).toString('base64')}`
	};
	return assets;
}

// Minimal element helper so this file doesn't need JSX.
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
	type,
	props: { style: { display: 'flex', ...style }, children: children.length === 1 ? children[0] : children }
});

function background(seed: number): string {
	const peaks = [
		{ x: 1020, y: 120, rings: 13 },
		{ x: 1180, y: 560, rings: 8 },
		{ x: 80, y: 600, rings: 5 }
	];
	const paths = contours(seed, peaks, OG_HEIGHT)
		.map((p) => `<path d="${p.d}" fill="none" stroke="${C.contour}" stroke-width="${p.index ? 2.4 : 1.2}"/>`)
		.join('');
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 1200 630">${paths}</svg>`;
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export async function renderOgImage({ kicker, title, key }: { kicker: string; title: string; key: string }): Promise<Uint8Array> {
	const { fonts, avatar } = load();
	const size = title.length > 60 ? 60 : title.length > 34 ? 72 : 88;

	const card = h(
		'div',
		{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: C.bg, fontFamily: 'Bricolage', color: C.ink },
		{ type: 'img', props: { src: background(seedFrom(key)), width: OG_WIDTH, height: OG_HEIGHT, style: { position: 'absolute', left: 0, top: 0 } } },
		h(
			'div',
			{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px' },
			h(
				'div',
				{ display: 'flex', alignItems: 'center', fontFamily: 'Plex Mono', fontSize: 24, letterSpacing: 2, color: C.muted, textTransform: 'uppercase' },
				h('div', { width: 16, height: 16, background: C.trail, transform: 'rotate(45deg)', marginRight: 20 }),
				kicker
			),
			h('div', { display: 'flex', fontSize: size, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }, title),
			h(
				'div',
				{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `2px dashed ${C.line}`, paddingTop: 28 },
				h(
					'div',
					{ display: 'flex', alignItems: 'center' },
					{ type: 'img', props: { src: avatar, width: 64, height: 64, style: { borderRadius: 32, border: `3px solid ${C.trail}`, marginRight: 20 } } },
					h('div', { fontSize: 30, fontWeight: 800 }, 'Quinn Chrest')
				),
				h('div', { fontFamily: 'Plex Mono', fontSize: 24, color: C.trail }, 'quinnchrest.dev')
			)
		)
	);

	const svg = await satori(card as unknown as Parameters<typeof satori>[0], { width: OG_WIDTH, height: OG_HEIGHT, fonts });
	return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
