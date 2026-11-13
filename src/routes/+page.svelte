<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import Trail from '$lib/components/Trail.svelte';
	import Trailhead from '$lib/components/Trailhead.svelte';
	import { SITE_URL } from '$lib/format';

	let { data } = $props();

	const description =
		'Quinn Chrest is a software developer in Chanhassen, MN. Browse side projects built with Svelte, React, Python and the Claude API, and read the dev log.';

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
		<span class="mono">Trailhead · You are here</span>
		<h1>Building side projects <em>one mile</em> at a time.</h1>
		<p>
			I'm Quinn, a software developer in Chanhassen, MN. I like bike rides, taking photos, and building things on
			evenings and weekends. Here's the map of where it's all gone.
		</p>
		<div class="coords mono">
			<span>44.86° N, 93.53° W</span>
			<span>{data.projectCount} projects logged</span>
			<span>{data.entryCount} log entries</span>
		</div>
	</section>

	<section aria-labelledby="work">
		<div class="section-head">
			<h2 id="work">Trailheads</h2>
			<a class="mono" href="/projects">All projects →</a>
		</div>
		<div class="trailheads">
			{#each data.featured as project, i (project.slug)}
				<Trailhead {project} eager={i < 3} />
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

	<section aria-labelledby="log">
		<div class="section-head">
			<h2 id="log">Trail log</h2>
			<a class="mono" href="/log">All {data.entryCount} entries →</a>
		</div>
		<Trail entries={data.latest} />
	</section>

	<section aria-labelledby="stats-title" id="stats">
		<div class="section-head">
			<h2 id="stats-title">Elevation profile</h2>
			<a class="mono" href="https://github.com/QuinnChrest" target="_blank" rel="noopener">Live from GitHub ↗</a>
		</div>
		<Stats initial={data.github} projects={data.projectCount} entries={data.entryCount} />
	</section>
</div>

<style>
	.hero {
		padding: 100px 0 120px;
		max-width: 740px;
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
			padding: 56px 0 72px;
		}
	}
	@media (min-width: 600px) and (max-width: 900px) {
		.trailheads,
		.others {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
