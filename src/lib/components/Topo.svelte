<script lang="ts">
	// Decorative contour lines: wobbly rings around a few "peaks". Built from a
	// fixed seed, so the same seed draws the same map in every build and no
	// JavaScript is needed to show it.
	type Peak = { x: number; y: number; rings: number };

	let {
		seed = 1,
		peaks = [
			{ x: 950, y: 220, rings: 16 },
			{ x: 1150, y: 640, rings: 10 },
			{ x: 60, y: 660, rings: 7 }
		],
		height = 760
	}: { seed?: number; peaks?: Peak[]; height?: number } = $props();

	function random(s: number) {
		return () => {
			s = (s * 16807) % 2147483647;
			return s / 2147483647;
		};
	}

	const paths = $derived.by(() => {
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
				out.push({ d: d + 'Z', index: r % 5 === 0 });
			}
		}
		return out;
	});
</script>

<svg viewBox="0 0 1200 {height}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="height: {height}px">
	{#each paths as p}
		<path d={p.d} stroke-width={p.index ? 1.6 : 0.8} />
	{/each}
</svg>

<style>
	svg {
		position: absolute;
		inset: 0 0 auto 0;
		width: 100%;
		z-index: -1;
		pointer-events: none;
		mask-image: linear-gradient(to bottom, #000 60%, transparent);
	}
	path {
		fill: none;
		stroke: var(--contour);
	}
</style>
