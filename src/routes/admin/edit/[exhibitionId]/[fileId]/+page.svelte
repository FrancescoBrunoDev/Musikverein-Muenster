<script lang="ts">
	import type { PageData } from './$types';
	import DOMPurify from 'isomorphic-dompurify';
	import { onMount } from 'svelte';
	import { Save, CloudAlert } from 'lucide-svelte';
	import Button from '$components/ui/Button.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import Selector from '$components/ui/Selector.svelte';
	import { goto } from '$app/navigation';

	import { Carta, MarkdownEditor } from 'carta-md';
	// Component default theme
	import 'carta-md/default.css';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let value: string | undefined = $state('');
	let activeLang: string = $state('en');

	let saveStatus: { state: boolean; updated: string } = $state({
		state: false,
		updated: ''
	});
	let publishStatus: { state: boolean; updated: string } = $state({
		state: false,
		updated: ''
	});
	let options = $derived.by(() => {
		let items: { label: string; value: string; id: string }[] = [];
		data.exhibition?.expand?.files.forEach((item: { lang: any; id: any }) => {
			items.push({ label: item.lang, value: item.lang, id: item.id });
		});
		return items;
	});

	$effect(() => {
		let fileId = options.find((item) => item.value === activeLang)?.id;
		goto(`/admin/edit/${data.exhibition?.id}/${fileId}`);
		value = data.markdown;
	});

	onMount(() => {
		value = data.markdown;
		activeLang = data.file.lang;
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
		const res = await fetch('/api/exhibitions/pb/updateFile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: data.file.id,
				markdown: value,
				field: 'preview',
				collection: 'exhibitionsFiles'
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

	async function publish() {
		const res = await fetch('/api/exhibitions/pb/publishExhibition', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: data.file.id
			})
		});
		const result = await res.json();

		if (result.success) {
			publishStatus = {
				state: true,
				updated: result.updated
			};
		} else {
			publishStatus = {
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
				><a href="/{activeLang}/preview/{data.exhibition?.id}">Preview</a></Button
			>
			<div>
				<Selector {options} bind:active={activeLang} />
			</div>
		</div>
		<!-- TODO: fai una funzione che salva il file in preview e live -->
		<div>
			<Button action={publish} type={'button'} className="px-4 w-fit" label="Publish"></Button>
		</div>
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
