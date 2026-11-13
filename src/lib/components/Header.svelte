<script lang="ts">
	import { page } from '$app/state';
	import Search from './Search.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '/projects', label: 'Projects' },
		{ href: 'https://quinnchrest.com', label: 'Blog', external: true },
		// Hidden on phones to make room; the stats are on the home page anyway.
		{ href: '/#stats', label: 'Stats', wide: true }
	];

	// On the home page, glide down to the stats instead of jumping there.
	function toSection(e: MouseEvent, href: string) {
		const id = href.split('#')[1];
		if (!id || page.url.pathname !== '/' || e.metaKey || e.ctrlKey || e.shiftKey) return;
		const el = document.getElementById(id);
		if (!el) return;
		e.preventDefault();
		const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
		el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
	}

	// Notes live under their project, so /notes also highlights Projects.
	const current = (href: string) =>
		href === '/projects' && (page.url.pathname.startsWith('/projects') || page.url.pathname.startsWith('/notes'));
</script>

<header class="wrap">
	<a class="logo" href="/"><i aria-hidden="true"></i>Quinn Chrest</a>
	<nav aria-label="Main">
		{#each links as link}
			<a
				href={link.href}
				class:wide={link.wide}
				aria-current={current(link.href) ? 'page' : undefined}
				onclick={(e) => toSection(e, link.href)}
				target={link.external ? '_blank' : undefined}
				rel={link.external ? 'noopener me' : undefined}>{link.label}</a
			>
		{/each}
		<Search />
		<ThemeToggle />
	</nav>
</header>

<style>
	header {
		/* Stays put during page transitions instead of crossfading. */
		view-transition-name: site-header;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding-top: 20px;
		padding-bottom: 20px;
	}
	.logo {
		font-weight: 800;
		font-size: 18px;
		display: flex;
		gap: 10px;
		align-items: center;
		white-space: nowrap;
	}
	.logo i {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--trail);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--trail) 25%, transparent);
	}
	nav {
		display: flex;
		align-items: center;
		gap: 22px;
	}
	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--trail);
	}
	@media (max-width: 760px) {
		nav {
			gap: 14px;
		}
	}
	@media (max-width: 520px) {
		.wide {
			display: none;
		}
		nav {
			gap: 10px;
			font-size: 15px;
		}
		.logo {
			font-size: 16px;
			gap: 8px;
		}
	}
</style>
