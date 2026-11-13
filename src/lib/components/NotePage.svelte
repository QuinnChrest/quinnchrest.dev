<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL, categoryLabel, formatDate } from '$lib/format';
	import type { Note } from '$lib/types';

	type Link = { url: string; title: string } | null;

	let {
		note,
		project,
		back,
		newer,
		older
	}: {
		note: Note;
		/** The project this note is about; null for changelog notes */
		project: { slug: string; title: string; image: string } | null;
		back: { href: string; label: string };
		newer: Link;
		older: Link;
	} = $props();

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: note.title,
		datePublished: note.date,
		description: note.excerpt,
		url: SITE_URL + note.url,
		keywords: note.tags.join(', '),
		author: { '@id': `${SITE_URL}/#person` }
	});
</script>

<Seo
	title="{note.title} | {project ? project.title : 'Changelog'} | Quinn Chrest"
	description={note.excerpt}
	type="article"
	published={note.date}
	image={note.ogImage}
/>
<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div class="wrap">
	<a class="mono back" href={back.href}>← {back.label}</a>

	<article>
		{#if note.visibility !== 'published'}
			<p class="pending">
				{note.visibility === 'draft'
					? 'Draft: only visible in npm run dev. Remove `draft: true` to publish.'
					: 'Scheduled: only visible in npm run dev until the daily deploy on its date.'}
			</p>
		{/if}
		<header>
			<p class="mono meta">
				<time datetime={note.date.slice(0, 10)}>{formatDate(note.date)}</time>
				<span>{categoryLabel[note.category]}</span>
				<span>{note.readingMinutes} min read</span>
			</p>
			<h1>{note.title}</h1>
			{#if project}
				<a class="project" href="/projects/{project.slug}">
					<img src={project.image} alt="" width="40" height="40" />
					<span><span class="mono">Project</span><br />{project.title}</span>
				</a>
			{/if}
		</header>

		<div class="prose">{@html note.html}</div>

		{#if note.tags.length}
			<ul class="tags" aria-label="Tags">
				{#each note.tags as t}<li>{t}</li>{/each}
			</ul>
		{/if}
	</article>

	{#if older || newer}
		<nav class="pager" aria-label="More notes">
			{#if older}
				<a href={older.url}><span class="mono">← Older</span>{older.title}</a>
			{:else}<span></span>{/if}
			{#if newer}
				<a class="newer" href={newer.url}><span class="mono">Newer →</span>{newer.title}</a>
			{/if}
		</nav>
	{/if}
</div>

<style>
	.back {
		display: inline-block;
		margin-top: 40px;
	}
	.pending {
		margin: 20px 0 0;
		padding: 10px 14px;
		border: 1px dashed var(--trail);
		border-radius: 10px;
		color: var(--trail);
		font-size: 15px;
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
