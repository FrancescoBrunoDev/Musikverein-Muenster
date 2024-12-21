<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import DOMPurify from 'isomorphic-dompurify';
	import { onMount } from 'svelte';
	import { Save, CloudAlert } from 'lucide-svelte';

	import { Carta, MarkdownEditor } from 'carta-md';
	// Component default theme
	import 'carta-md/default.css';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let value: string | undefined = $state('');

	let saveStatus: { state: boolean; updated: string } = $state({
		state: false,
		updated: ''
	});

	onMount(() => {
		value = data.markdown;
	});

	let debounceTimer: ReturnType<typeof setTimeout>;
	// submit the form whebn value changes
	$effect(() => {
		if (value) {
			// Cancella il timer precedente
			clearTimeout(debounceTimer);

			// Imposta un nuovo timer
			debounceTimer = setTimeout(() => {
				// Esegue il submit solo dopo 1000ms di inattività
				save();
			}, 1000);
		}
	});

	async function save() {
		const res = await fetch('/api/exhibitions/pb/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: data.file.id,
				markdown: value
			})
		});
		const result = await res.json();
		console.log(result);
		if (result.success) {
			saveStatus = {
				state: true,
				updated: result.updated
			};
		} else {
			saveStatus = {
				state: false,
				updated: result.message
			};
		}
	}
	$inspect(saveStatus);
	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});
</script>

<div class="h-[93dvh]">
	<MarkdownEditor {carta} bind:value mode="tabs" />
	{#if !saveStatus.state}
		<div
			class="variant-soft-success px-4 py-2 mb-2 rounded-token flex items-center gap-1 text-destructive"
		>
			<CloudAlert class="h-5 w-5" />
			{saveStatus.updated}
		</div>
	{/if}
	{#if saveStatus.state}
		<div class="variant-soft-success px-4 py-2 mb-2 rounded-token flex items-center gap-1">
			<Save class="h-5 w-5" />last save {saveStatus.updated}
		</div>
	{/if}
</div>

<style>
	:global(.carta-font-code) {
		font-family: 'Outfit';
	}
</style>
