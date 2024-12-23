<script lang="ts">
	import type { PageData } from './$types';
	import DOMPurify from 'isomorphic-dompurify';
	import { onMount } from 'svelte';
	import { Save, CloudAlert, CircleCheckBig } from 'lucide-svelte';
	import Button from '$components/ui/Button.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import Selector from '$components/ui/Selector.svelte';
	import { goto } from '$app/navigation';
	import { LL } from '$lib/i18n/i18n-svelte';

	import { Carta, MarkdownEditor, Markdown } from 'carta-md';
	// Component default theme
	import 'carta-md/default.css';
	import { cn } from '$lib/utils';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let value: string = $state('');
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
		value = data.markdown ?? '';
		publishStatus = {
			state: data.file?.live,
			updated: new Date(data.file?.liveUpdated).toLocaleString($LL.commons.codeLang(), {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		};
	});

	onMount(() => {
		value = data.markdown ?? '';
		activeLang = data.file?.lang;
		publishStatus = {
			state: data.file?.live,
			updated: new Date(data.file?.liveUpdated).toLocaleString($LL.commons.codeLang(), {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		};
	});

	let debounceTimer: ReturnType<typeof setTimeout>;
	// submit the form whebn value changes
	async function saveAndUpdateEditing() {
		try {
			await Promise.all([save(), changeEditingBy()]);
		} catch (error) {
			console.error('Errore durante il salvataggio:', error);
		}
	}

	$effect(() => {
		if (value && !data.isLocked) {
			clearTimeout(debounceTimer);

			debounceTimer = setTimeout(() => {
				saveAndUpdateEditing();
			}, 1000);
		}
	});

	async function changeEditingBy() {
		await fetch('/api/exhibitions/pb/changeEditingBy', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: data.file?.id
			})
		});
	}

	async function save() {
		const res = await fetch('/api/exhibitions/pb/updateFile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: data.file?.id,
				markdown: value,
				field: 'preview',
				collection: 'exhibitionsFiles'
			})
		});
		const result = await res.json();
		if (result.success) {
			saveStatus = {
				state: true,
				updated: new Date(result.updated.previewUpdated).toLocaleString($LL.commons.codeLang(), {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			};
		} else {
			saveStatus = {
				state: false,
				updated: result.message
			};
		}
	}

	async function publish() {
		const res = await fetch('/api/exhibitions/pb/publishFile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: data.file?.id
			})
		});
		const result = await res.json();

		if (result.success) {
			publishStatus = {
				state: true,
				updated: new Date(result.updated.liveUpdated).toLocaleString($LL.commons.codeLang(), {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			};
		} else {
			publishStatus = {
				state: false,
				updated: result.message
			};
		}
	}

	async function unpublish() {
		const res = await fetch('/api/exhibitions/pb/unpublishFile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: data.file?.id
			})
		});
		const result = await res.json();

		if (result.success) {
			publishStatus = {
				state: false,
				updated: ''
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

<div class="h-[93dvh] mb-1">
	<div class="flex justify-between">
		<div class="flex items-center gap-4">
			<Button type={'button'} size="sm" className="pr-4 w-fit" icon={ChevronLeft}
				><a href="/admin">back</a></Button
			>
			<Button type={'button'} size="sm" className="px-4 w-fit"
				><a href="/{activeLang}/preview/{data.exhibition?.id}">Preview</a></Button
			>
			<div>
				<Selector {options} bind:active={activeLang} />
			</div>
		</div>
		<!-- TODO: fai una funzione che salva il file in preview e live -->
		<div class="flex gap-2">
			<Button action={publish} size="sm" type={'button'} label="Publish" />
			{#if publishStatus.state}
				<Button action={unpublish} size="sm" type={'button'} label="Unpublish" />
			{/if}
		</div>
	</div>
	<div class="text-xs h-6 flex justify-end gap-1">
		{#if publishStatus.state}
			<CircleCheckBig class="h-4 w-4" />last publish {publishStatus.updated}
		{:else}
			<span>not published jet</span>
		{/if}
	</div>
	{#if value !== ''}
		{#if data.isLocked}
			<Markdown bind:value {carta} />
			<div
				class="variant-soft-danger rounded-token mb-2 flex items-center gap-1 px-4 py-2 text-destructive"
			>
				<CloudAlert class="h-5 w-5" />
				Editing by {data.file.editingBy}
			</div>
		{:else}
			<MarkdownEditor {carta} bind:value mode="tabs" />
			{#if !saveStatus.state}
				<div
					class="variant-soft-success rounded-token mb-2 flex items-center gap-1 px-4 py-2 text-destructive"
				>
					<CloudAlert class="h-5 w-5" />
					{saveStatus.updated}
				</div>
			{/if}
			{#if saveStatus.state}
				<div class="variant-soft-success rounded-token mb-2 flex items-center gap-1 px-4 py-2">
					<Save class="h-5 w-5" />last save {saveStatus.updated}
				</div>
			{/if}
		{/if}
	{:else}
		<div class="flex h-[93dvh] items-center justify-center">
			<p class="text-center">Loading...</p>
		</div>
	{/if}
</div>

<style>
	:global(.carta-font-code) {
		font-family: 'Outfit';
	}
	:global(.carta-theme__default.carta-editor) {
		@apply rounded-xl border-2 border-border;
	}
	:global(.carta-theme__default .carta-toolbar) {
		@apply border-b-2 border-border pb-1 pt-2;
	}
	:gloabl(.carta-font-code) {
		@apply text-text;
	}
</style>
