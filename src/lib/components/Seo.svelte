<script lang="ts">
	import { page } from '$app/state';
	import { SITE_URL } from '$lib/format';

	let {
		title,
		description,
		image = '/og/site.png',
		type = 'website',
		published
	}: { title: string; description: string; image?: string; type?: 'website' | 'article'; published?: string } = $props();

	const url = $derived(SITE_URL + page.url.pathname);
	const imageUrl = $derived(image.startsWith('http') ? image : SITE_URL + image);
	// Generated share cards (src/routes/og) are 1200x630 and get the big preview.
	const card = $derived(image.startsWith('/og/'));
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
	{#if card}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content={title} />
	{/if}
	<meta property="og:locale" content="en_US" />
	{#if published}<meta property="article:published_time" content={published} />{/if}
	<meta name="twitter:card" content={card ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
