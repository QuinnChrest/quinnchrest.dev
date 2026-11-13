<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PhotoStrip from '$lib/components/PhotoStrip.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import Trail from '$lib/components/Trail.svelte';
	import Trailhead from '$lib/components/Trailhead.svelte';
	import { SITE_URL } from '$lib/format';
	import type { TrailItem } from '$lib/types';

	let { data } = $props();

	const description =
		'Quinn Chrest is a software developer in Chanhassen, MN. Browse side projects built with SvelteKit, React, Python and the Claude API, with notes on how each one works.';

	const blogItems: TrailItem[] = $derived(
		(data.blog ?? []).map((post) => ({
			key: post.url,
			href: post.url,
			date: post.date,
			meta: 'quinnchrest.com ↗',
			title: post.title,
			excerpt: post.excerpt,
			image: post.image,
			external: true
		}))
	);

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${SITE_URL}/#website`,
				url: `${SITE_URL}/`,
				name: 'Quinn Chrest',
				description,
				publisher: { '@id': `${SITE_URL}/#person` }
			},
			{
				'@type': 'Person',
				'@id': `${SITE_URL}/#person`,
				name: 'Quinn Chrest',
				url: `${SITE_URL}/`,
				image: `${SITE_URL}/avatar.jpg`,
				jobTitle: 'Software Developer',
				address: { '@type': 'PostalAddress', addressLocality: 'Chanhassen', addressRegion: 'MN', addressCountry: 'US' },
				sameAs: ['https://github.com/QuinnChrest', 'https://www.linkedin.com/in/quinn-chrest-533581140/', 'https://quinnchrest.com/']
			}
		]
	};
</script>

<Seo title="Quinn Chrest | Software Developer" {description} />
<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div class="wrap">
	<section class="hero">
		<figure class="pin">
			<img src="/avatar.jpg" alt="Quinn Chrest" width="512" height="512" />
			<figcaption class="mono">You are here</figcaption>
		</figure>
		<div class="intro">
		<span class="mono">Trailhead</span>
		<h1>Building side projects <em>one mile</em> at a time.</h1>
		<p>
			I'm Quinn, a software developer in Chanhassen, MN. I like bike rides, taking photos, and building things on
			evenings and weekends. Here's the map of where it's all gone.
		</p>
		<div class="coords mono">
			<span>44.86° N, 93.53° W</span>
			<span>{data.projectCount} projects logged</span>
			<span>{data.noteCount} project notes</span>
		</div>
		</div>
	</section>

	<section aria-labelledby="work">
		<div class="section-head">
			<h2 id="work">Trailheads</h2>
			<a class="mono" href="/projects">All projects →</a>
		</div>
		<div class="trailheads">
			{#each data.featured as project, i (project.slug)}
				<Trailhead {project} eager={i < 3} latest={data.latest[project.slug]} />
			{/each}
		</div>
		{#if data.others.length}
			<ul class="others">
				{#each data.others as project (project.slug)}
					<li>
						<a href="/projects/{project.slug}"><b>{project.title}</b><span class="mono">{project.technologies[0] ?? ''}</span></a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	{#if data.photos?.length}
		<section aria-labelledby="photos">
			<div class="section-head">
				<h2 id="photos">From the trail</h2>
				<a class="mono" href="https://photos.quinnchrest.dev" target="_blank" rel="noopener">All photos ↗</a>
			</div>
			<PhotoStrip photos={data.photos} />
		</section>
	{/if}

	{#if blogItems.length}
		<section aria-labelledby="log">
			<div class="section-head">
				<h2 id="log">Trail log</h2>
				<a class="mono" href="https://quinnchrest.com" target="_blank" rel="noopener me">Read the blog ↗</a>
			</div>
			<Trail items={blogItems} />
		</section>
	{/if}

	<section aria-labelledby="stats-title" id="stats">
		<div class="section-head">
			<h2 id="stats-title">Elevation profile</h2>
			<a class="mono" href="https://github.com/QuinnChrest" target="_blank" rel="noopener">Live from GitHub ↗</a>
		</div>
		<Stats initial={data.github} projects={data.projectCount} notes={data.noteCount} />
	</section>
</div>

<style>
	.hero {
		padding: 100px 0 120px;
		display: grid;
		grid-template-columns: minmax(0, 740px) 1fr;
		align-items: center;
		gap: 40px;
	}
	.intro {
		grid-row: 1;
	}
	/* Photo as a map pin: ring, pointer and a pulsing "you are here" dot. */
	.pin {
		grid-column: 2;
		grid-row: 1;
		justify-self: center;
		position: relative;
		margin: 0;
		width: 240px;
		padding-bottom: 46px;
	}
	.pin img {
		display: block;
		width: 240px;
		height: 240px;
		border-radius: 50%;
		object-fit: cover;
		border: 6px solid var(--trail);
		box-shadow: var(--shadow);
		background: var(--line);
	}
	.pin::before {
		/* pointer under the circle */
		content: '';
		position: absolute;
		left: 50%;
		top: 228px;
		width: 26px;
		height: 26px;
		background: var(--trail);
		transform: translateX(-50%) rotate(45deg);
		border-radius: 0 0 6px 0;
		z-index: -1;
	}
	.pin::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 14px;
		height: 14px;
		margin-left: -7px;
		border-radius: 50%;
		background: var(--trail);
		box-shadow: 0 0 0 0 color-mix(in srgb, var(--trail) 50%, transparent);
		animation: ping 2.4s ease-out infinite;
	}
	@keyframes ping {
		70%,
		100% {
			box-shadow: 0 0 0 18px transparent;
		}
	}
	figcaption {
		position: absolute;
		left: calc(50% + 18px);
		bottom: -3px;
		white-space: nowrap;
	}
	h1 {
		font-size: clamp(42px, 7vw, 84px);
		line-height: 1;
		letter-spacing: -0.03em;
		margin: 14px 0 22px;
		font-weight: 800;
	}
	h1 em {
		font-style: normal;
		color: var(--trail);
	}
	.hero p {
		font-size: 19px;
		color: var(--muted);
		margin: 0;
		max-width: 580px;
	}
	.coords {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
		margin-top: 28px;
	}
	.trailheads {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	.others {
		list-style: none;
		padding: 0;
		margin: 20px 0 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0 20px;
	}
	.others a {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px dashed var(--line);
	}
	.others a:hover b {
		color: var(--trail);
	}
	@media (max-width: 900px) {
		.trailheads,
		.others {
			grid-template-columns: 1fr;
		}
		.hero {
			padding: 40px 0 72px;
			grid-template-columns: 1fr;
			gap: 20px;
		}
		.pin {
			grid-column: 1;
			justify-self: start;
			width: 120px;
			padding-bottom: 30px;
		}
		.pin img {
			width: 120px;
			height: 120px;
			border-width: 4px;
		}
		.pin::before {
			top: 110px;
			width: 16px;
			height: 16px;
		}
		.pin::after {
			width: 10px;
			height: 10px;
			margin-left: -5px;
		}
		.intro {
			grid-row: 2;
		}
	}
	@media (min-width: 600px) and (max-width: 900px) {
		.trailheads,
		.others {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
