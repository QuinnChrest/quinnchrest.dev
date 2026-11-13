<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Off the map' : 'Something went wrong'} | Quinn Chrest</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap">
	<span class="mono">Error {page.status}</span>
	{#if page.status === 404}
		<h1>You've wandered off the map.</h1>
		<p>There's no trail here. It may have moved when the site was redesigned.</p>
	{:else}
		<h1>Something went wrong.</h1>
		<p>{page.error?.message}</p>
	{/if}
	<div class="links">
		<a href="/">Back to the trailhead</a>
		<a href="/projects">Projects</a>
		<a href="/notes">Project notes</a>
	</div>
</div>

<style>
	.wrap {
		padding-top: 100px;
		max-width: 720px;
	}
	h1 {
		font-size: clamp(36px, 6vw, 64px);
		font-weight: 800;
		margin: 12px 0 16px;
	}
	p {
		color: var(--muted);
		font-size: 19px;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin-top: 28px;
		font-weight: 600;
	}
	.links a {
		color: var(--trail);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
