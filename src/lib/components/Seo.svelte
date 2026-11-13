<script lang="ts">
	import { page } from '$app/state';
	import { SITE_URL } from '$lib/format';

	let {
		title,
		description,
		image = '/avatar.jpg',
		type = 'website',
		published
	}: { title: string; description: string; image?: string; type?: 'website' | 'article'; published?: string } = $props();

	const url = $derived(SITE_URL + page.url.pathname);
	const imageUrl = $derived(image.startsWith('http') ? image : SITE_URL + image);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="Quinn Chrest" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content="en_US" />
	{#if published}<meta property="article:published_time" content={published} />{/if}
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
