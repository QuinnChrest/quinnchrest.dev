<script lang="ts">
	import NotesIndex from '$lib/components/NotesIndex.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();
</script>

<Seo
	title="Project notes | Quinn Chrest"
	description="Notes from building side projects: what each one is, how it works and what broke along the way."
/>

<NotesIndex notes={data.notes} projectTitles={data.projectTitles} kicker="Trail markers" title="Project notes">
	{#snippet intro()}
		Every note from every project, newest first. Each one also lives on its <a href="/projects">project's page</a>.
	{/snippet}
</NotesIndex>
