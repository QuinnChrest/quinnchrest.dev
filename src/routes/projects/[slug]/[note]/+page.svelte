<script lang="ts">
	import NotePage from '$lib/components/NotePage.svelte';

	let { data } = $props();
</script>

<NotePage
	note={data.note}
	project={data.project}
	back={{ href: `/projects/${data.project.slug}`, label: data.project.title }}
	newer={data.newer}
	older={data.older}
/>
