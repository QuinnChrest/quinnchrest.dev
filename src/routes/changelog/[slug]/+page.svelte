<script lang="ts">
	import NotePage from '$lib/components/NotePage.svelte';

	let { data } = $props();
</script>

<NotePage note={data.note} project={null} back={{ href: '/changelog', label: 'Changelog' }} newer={data.newer} older={data.older} />
