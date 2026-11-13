<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { search, type SearchHit } from '$lib/search';
	import type { SearchDoc } from '$lib/types';

	let dialog: HTMLDialogElement;
	let input = $state<HTMLInputElement>();
	let query = $state('');
	let docs = $state<SearchDoc[] | null>(null);
	let failed = $state(false);
	let active = $state(0);
	let mac = $state(false);

	const hits: SearchHit[] = $derived(docs ? search(docs, query) : []);
	$effect(() => {
		// Reset the highlighted result whenever the results change.
		void hits;
		active = 0;
	});

	async function open() {
		dialog.showModal();
		await tick();
		input?.select();
		if (!docs) {
			try {
				const res = await fetch('/search.json');
				docs = await res.json();
			} catch {
				failed = true;
			}
		}
	}

	function close() {
		dialog.close();
	}

	function go(url: string) {
		close();
		query = '';
		goto(url);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			active = Math.min(active + 1, hits.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(active - 1, 0);
		} else if (e.key === 'Enter' && hits[active]) {
			e.preventDefault();
			go(hits[active].doc.url);
		}
	}

	onMount(() => {
		mac = /Mac|iPhone|iPad/.test(navigator.platform);
		const onGlobalKey = (e: KeyboardEvent) => {
			const typing = e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable]');
			if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
				e.preventDefault();
				if (!dialog.open) open();
			}
		};
		addEventListener('keydown', onGlobalKey);
		return () => removeEventListener('keydown', onGlobalKey);
	});
</script>

<button class="trigger" onclick={open} aria-label="Search the site" title="Search ({mac ? '⌘' : 'Ctrl+'}K)">
	<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
	<span class="label">Search</span>
	<kbd>{mac ? '⌘' : 'Ctrl'} K</kbd>
</button>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} onclick={(e) => e.target === dialog && close()} aria-label="Search">
	<div class="box">
		<div class="field">
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
			<input
				bind:this={input}
				bind:value={query}
				onkeydown={onKeydown}
				type="search"
				placeholder="Search projects and the dev log…"
				aria-label="Search"
				aria-controls="search-results"
				aria-activedescendant={hits.length ? `hit-${active}` : undefined}
				autocomplete="off"
				spellcheck="false"
			/>
			<button class="esc" onclick={close} aria-label="Close search">Esc</button>
		</div>

		{#if failed}
			<p class="empty">Search couldn't load. Check your connection and try again.</p>
		{:else if !docs}
			<p class="empty">Loading…</p>
		{:else if !query.trim()}
			<p class="empty">Try <button onclick={() => (query = 'claude')}>claude</button>, <button onclick={() => (query = 'github pages')}>github pages</button> or <button onclick={() => (query = 'react')}>react</button>.</p>
		{:else if !hits.length}
			<p class="empty">Nothing on the map for “{query}”.</p>
		{:else}
			<ul id="search-results" role="listbox" aria-label="Results">
				{#each hits as hit, i (hit.doc.url)}
					<li id="hit-{i}" role="option" aria-selected={i === active}>
						<a href={hit.doc.url} onclick={(e) => (e.preventDefault(), go(hit.doc.url))} onmousemove={() => (active = i)}>
							<span class="mono">{hit.doc.type === 'project' ? 'Project' : 'Log'} · {hit.doc.meta}</span>
							<b>{hit.doc.title}</b>
							{#if hit.snippet}
								<span class="snip">{hit.snippet.before}<mark>{hit.snippet.match}</mark>{hit.snippet.after}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</dialog>

<style>
	.trigger {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 10px 0 12px;
		border-radius: 99px;
		border: 1px solid var(--line);
		background: var(--bg-raised);
		color: var(--muted);
		font: inherit;
		font-size: 14px;
		cursor: pointer;
	}
	.trigger:hover {
		border-color: var(--trail);
		color: var(--ink);
	}
	svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		flex: none;
	}
	kbd {
		font-family: var(--font-mono);
		font-size: 11px;
		border: 1px solid var(--line);
		border-radius: 4px;
		padding: 0 5px;
	}
	@media (max-width: 760px) {
		.trigger {
			width: 36px;
			padding: 0;
			justify-content: center;
		}
		.label,
		kbd {
			display: none;
		}
	}

	dialog {
		width: min(640px, calc(100vw - 24px));
		max-height: min(70vh, 640px);
		margin: 12vh auto auto;
		padding: 0;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--bg-raised);
		color: var(--ink);
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
		overflow: hidden;
	}
	dialog::backdrop {
		background: rgba(10, 14, 11, 0.45);
		backdrop-filter: blur(3px);
	}
	.box {
		display: flex;
		flex-direction: column;
		max-height: inherit;
	}
	.field {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 16px;
		border-bottom: 1px solid var(--line);
		color: var(--muted);
	}
	input {
		flex: 1;
		min-width: 0;
		border: 0;
		background: none;
		color: var(--ink);
		font: inherit;
		font-size: 18px;
		outline: none;
	}
	input::-webkit-search-cancel-button {
		display: none;
	}
	.esc {
		font-family: var(--font-mono);
		font-size: 11px;
		border: 1px solid var(--line);
		border-radius: 4px;
		background: none;
		color: var(--muted);
		padding: 2px 6px;
		cursor: pointer;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 8px;
		overflow-y: auto;
	}
	li a {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 10px 12px;
		border-radius: 10px;
	}
	li[aria-selected='true'] a {
		background: color-mix(in srgb, var(--trail) 12%, transparent);
	}
	li[aria-selected='true'] b {
		color: var(--trail);
	}
	b {
		font-size: 17px;
	}
	.snip {
		font-size: 14px;
		color: var(--muted);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	mark {
		background: color-mix(in srgb, var(--trail) 30%, transparent);
		color: var(--ink);
		border-radius: 3px;
		padding: 0 1px;
	}
	.empty {
		margin: 0;
		padding: 22px 18px;
		color: var(--muted);
	}
	.empty button {
		font: inherit;
		color: var(--trail);
		background: none;
		border: 0;
		padding: 0;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
</style>
