<script lang="ts">
	import NotesIndex from '$lib/components/NotesIndex.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();
</script>

<Seo
	title="Changelog | Quinn Chrest"
	description="Notes about quinnchrest.dev itself: how it's built and what changed, from the first launch to GitHub Pages."
/>

<NotesIndex notes={data.notes} kicker="Site notes" title="Changelog">
	{#snippet intro()}
		Notes about this website itself: how it's built and what changed along the way.
	{/snippet}
</NotesIndex>
