<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import DOMPurify from 'isomorphic-dompurify';
	import { onMount } from 'svelte';
	import { Save, CloudAlert } from 'lucide-svelte';
	import Button from '$components/ui/Button.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { locale } from '$states/stateGeneral.svelte';

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
				markdown: value,
				field: 'preview'
			})
		});
		const result = await res.json();

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

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});
</script>

<div class="h-[93dvh] flex flex-col gap-4">
	<div class="flex justify-between">
		<div class="flex gap-4">
			<Button type={'button'} className="px-4 w-fit" icon={ChevronLeft}
				><a href="/admin">back</a></Button
			>
			<Button type={'button'} className="px-4 w-fit"
				><a href="/{locale.current}/preview/{data.exhibition?.id}">Preview</a></Button
			>
		</div>
		<!-- TODO: fai una funzione che salva il file in preview e live -->
		<Button type={'button'} className="px-4 w-fit"
			><a href="/{locale.current}/preview/{data.exhibition?.id}">Pubblish</a></Button
		>
	</div>
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
