// Generates the site icons from one design: the orange trail dot (the same
// mark as next to "Quinn Chrest" in the header) on the dark Topo green.
//
//   npm run icons
//
// Writes static/favicon.svg, static/favicon-32.png and static/apple-touch-icon.png.
// The PNGs are committed, so this only needs to run when the design changes.
import { writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const BG = '#141a15';
const TRAIL = '#ff7448';

/**
 * @param {object} o
 * @param {number} o.radius corner radius of the background (0 for full bleed)
 * @param {number} o.dot dot radius, in a 64x64 box
 * @param {number} o.ring ring radius, in a 64x64 box
 */
function svg({ radius, dot, ring }) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
	<rect width="64" height="64" rx="${radius}" fill="${BG}"/>
	<circle cx="32" cy="32" r="${ring}" fill="${TRAIL}" fill-opacity="0.28"/>
	<circle cx="32" cy="32" r="${dot}" fill="${TRAIL}"/>
</svg>
`;
}

function png(source, size) {
	return new Resvg(source, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

// Browser tabs: rounded square, a bold dot so it reads at 16px.
const tab = svg({ radius: 14, dot: 14, ring: 23 });
writeFileSync('static/favicon.svg', tab);
writeFileSync('static/favicon-32.png', png(tab, 32));

// Home screen icon: full bleed (iOS rounds the corners itself) with more
// breathing room around the dot.
writeFileSync('static/apple-touch-icon.png', png(svg({ radius: 0, dot: 11, ring: 18 }), 180));

console.log('Wrote static/favicon.svg, static/favicon-32.png, static/apple-touch-icon.png');
