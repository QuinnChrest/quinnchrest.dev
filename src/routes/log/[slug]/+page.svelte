<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL, categoryLabel, formatDate } from '$lib/format';

	let { data } = $props();
	const e = $derived(data.entry);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: e.title,
		datePublished: e.date,
		description: e.excerpt,
		url: `${SITE_URL}/log/${e.slug}`,
		keywords: e.tags.join(', '),
		author: { '@id': `${SITE_URL}/#person` }
	});
</script>

<Seo title="{e.title} | Quinn Chrest" description={e.excerpt} type="article" published={e.date} image="/og/{e.slug}.png" />
<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div class="wrap">
	<a class="mono back" href="/log">← Dev log</a>

	<article>
		<header>
			<p class="mono meta">
				<time datetime={e.date.slice(0, 10)}>{formatDate(e.date)}</time>
				<span>{categoryLabel[e.category]}</span>
				<span>{e.readingMinutes} min read</span>
			</p>
			<h1>{e.title}</h1>
			{#if data.project}
				<a class="project" href="/projects/{data.project.slug}">
					<img src={data.project.image} alt="" width="40" height="40" />
					<span><span class="mono">Project</span><br />{data.project.title}</span>
				</a>
			{/if}
		</header>

		<div class="prose">{@html e.html}</div>

		{#if e.tags.length}
			<ul class="tags" aria-label="Tags">
				{#each e.tags as t}<li>{t}</li>{/each}
			</ul>
		{/if}
	</article>

	<nav class="pager" aria-label="More entries">
		{#if data.older}
			<a href="/log/{data.older.slug}"><span class="mono">← Older</span>{data.older.title}</a>
		{:else}<span></span>{/if}
		{#if data.newer}
			<a class="newer" href="/log/{data.newer.slug}"><span class="mono">Newer →</span>{data.newer.title}</a>
		{/if}
	</nav>
</div>

<style>
	.back {
		display: inline-block;
		margin-top: 40px;
	}
	.back:hover {
		color: var(--trail);
	}
	article {
		max-width: 720px;
	}
	header {
		padding: 24px 0 28px;
		margin-bottom: 32px;
		border-bottom: 1px dashed var(--line);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 18px;
		margin: 0;
	}
	h1 {
		font-size: clamp(36px, 5.5vw, 60px);
		font-weight: 800;
		margin: 12px 0 20px;
	}
	.project {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 8px 16px 8px 8px;
		border: 1px solid var(--line);
		border-radius: 12px;
		background: var(--bg-raised);
		line-height: 1.25;
		font-weight: 600;
	}
	.project:hover {
		border-color: var(--trail);
	}
	.project img {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		object-fit: cover;
	}
	.project .mono {
		font-size: 10px;
		font-weight: 400;
	}
	.tags {
		list-style: none;
		padding: 0;
		margin: 32px 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tags li {
		font-family: var(--font-mono);
		font-size: 12px;
		padding: 3px 10px;
		border: 1px solid var(--line);
		border-radius: 99px;
		color: var(--muted);
	}
	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-top: 56px;
		padding-top: 24px;
		border-top: 1px solid var(--line);
		max-width: 720px;
	}
	.pager a {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-weight: 600;
		font-size: 18px;
		line-height: 1.3;
	}
	.pager a:hover {
		color: var(--trail);
	}
	.pager .newer {
		text-align: right;
	}
	@media (max-width: 600px) {
		.pager {
			grid-template-columns: 1fr;
		}
		.pager .newer {
			text-align: left;
		}
		.back {
			margin-top: 24px;
		}
	}
</style>
