<script lang="ts">
	import { page } from '$app/state';
	import Search from './Search.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '/projects', label: 'Projects' },
		{ href: '/log', label: 'Log' },
		{ href: '/#stats', label: 'Stats' }
	];

	const current = (href: string) => !href.includes('#') && page.url.pathname.startsWith(href);
</script>

<header class="wrap">
	<a class="logo" href="/"><i aria-hidden="true"></i>Quinn Chrest</a>
	<nav aria-label="Main">
		{#each links as link}
			<a href={link.href} aria-current={current(link.href) ? 'page' : undefined}>{link.label}</a>
		{/each}
		<Search />
		<ThemeToggle />
	</nav>
</header>

<style>
	header {
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
