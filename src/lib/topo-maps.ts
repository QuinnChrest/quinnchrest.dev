import type { Peak } from './topo';

/**
 * The 15 background maps. Each page load draws one at random (see Topo.svelte).
 * They were picked by eye from generated candidates: one main mountain on the
 * right and lines kept thin behind the headline and intro text (the area
 * left of x=680, above y=560). Designed for a 1200x820 canvas; shorter pages
 * show the top of the map.
 */
export const MAPS: { seed: number; peaks: Peak[] }[] = [
	{ seed: 74018, peaks: [{ x: 1000, y: 693, rings: 16 }, { x: 216, y: 670, rings: 7 }] },
	{ seed: 76181, peaks: [{ x: 892, y: 674, rings: 17 }, { x: 16, y: 810, rings: 11 }, { x: 1072, y: 174, rings: 9 }] },
	{ seed: 70181, peaks: [{ x: 1128, y: 214, rings: 16 }, { x: 383, y: 374, rings: 3 }, { x: 954, y: 309, rings: 5 }] },
	{ seed: 27445, peaks: [{ x: 955, y: 628, rings: 14 }, { x: 540, y: 660, rings: 7 }] },
	{ seed: 68421, peaks: [{ x: 1041, y: 416, rings: 14 }, { x: 822, y: 375, rings: 6 }] },
	{ seed: 2747, peaks: [{ x: 982, y: 304, rings: 16 }, { x: 372, y: 356, rings: 5 }, { x: 518, y: 464, rings: 4 }] },
	{ seed: 60513, peaks: [{ x: 898, y: 110, rings: 14 }, { x: -2, y: 642, rings: 6 }] },
	{ seed: 98066, peaks: [{ x: 1071, y: 590, rings: 14 }, { x: 589, y: 404, rings: 4 }, { x: 285, y: 511, rings: 4 }] },
	{ seed: 68549, peaks: [{ x: 1118, y: 395, rings: 17 }, { x: 208, y: 622, rings: 8 }] },
	{ seed: 48589, peaks: [{ x: 831, y: 326, rings: 12 }, { x: 582, y: 801, rings: 7 }, { x: 476, y: 155, rings: 4 }] },
	{ seed: 24679, peaks: [{ x: 1138, y: 254, rings: 14 }, { x: 1175, y: 276, rings: 10 }, { x: 1140, y: 511, rings: 8 }, { x: 1168, y: 203, rings: 8 }] },
	{ seed: 66814, peaks: [{ x: 1171, y: 561, rings: 16 }, { x: 1112, y: 604, rings: 11 }] },
	{ seed: 10814, peaks: [{ x: 892, y: 556, rings: 15 }, { x: 1080, y: 388, rings: 9 }, { x: 846, y: 451, rings: 6 }, { x: 1190, y: 250, rings: 5 }] },
	{ seed: 94376, peaks: [{ x: 975, y: 693, rings: 16 }, { x: 797, y: 70, rings: 6 }] },
	{ seed: 91403, peaks: [{ x: 1174, y: 64, rings: 17 }, { x: 930, y: 188, rings: 10 }, { x: 980, y: 114, rings: 8 }] }
];
