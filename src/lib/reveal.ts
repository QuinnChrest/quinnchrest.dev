import type { Action } from 'svelte/action';

/**
 * Plays an entrance animation once, the first time the element scrolls into
 * view. The element gets `data-reveal="armed"` (hidden, ready to animate) and
 * then `data-reveal="in"` when it's on screen; the component's CSS animates
 * between the two.
 *
 * Nothing is hidden until this runs, so without JavaScript, or with "reduce
 * motion" turned on, everything simply shows in its final state.
 */
export const reveal: Action<HTMLElement> = (node) => {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

	// Already on screen when the page loads (or after navigating here): play
	// right away, but on the next frame so the hidden state paints first.
	node.dataset.reveal = 'armed';
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				requestAnimationFrame(() => (node.dataset.reveal = 'in'));
				observer.disconnect();
			}
		},
		{ rootMargin: '0px 0px -10% 0px' }
	);
	observer.observe(node);
	return { destroy: () => observer.disconnect() };
};
