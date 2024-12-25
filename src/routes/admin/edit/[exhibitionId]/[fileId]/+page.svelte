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
	import { formatData } from '$lib/utils';

	import { Carta, MarkdownEditor, Markdown } from 'carta-md';
	// Component default theme
	import 'carta-md/default.css';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let value: string = $state('');
	let activeLang: string = $state('en');

	let saveStatus: { state: boolean; updated: string } = $state({
		state: false,
		updated: 'loading'
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
			updated: formatData({
				date: data.file?.liveUpdated,
				lang: $LL.commons.codeLang()
			})
		};
	});

	onMount(() => {
		value = data.markdown ?? '';
		activeLang = data.file?.lang;
		publishStatus = {
			state: data.file?.live,
			updated: formatData({
				date: data.file?.liveUpdated,
				lang: $LL.commons.codeLang()
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
				updated: formatData({
					date: data.file?.previewUpdated,
					lang: $LL.commons.codeLang()
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
				updated: formatData({
					date: data.file?.liveUpdated,
					lang: $LL.commons.codeLang()
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

<svelte:head>
	<title>Editor</title>
	<meta property="og:title" content="edit" />
</svelte:head>

<div class="h-[93dvh]">
	<div class="flex justify-between">
		<div class="flex items-center gap-4">
			<Button
				href="/admin"
				label="Back"
				type={'button'}
				size="sm"
				className="pr-4 w-fit"
				icon={ChevronLeft}
			/>
			<Button
				href="/{activeLang}/preview/{data.exhibition?.id}"
				target="_blank"
				label="Preview"
				type={'button'}
				size="sm"
				className="px-4 w-fit"
			/>
			<div>
				<Selector {options} bind:active={activeLang} />
			</div>
		</div>
		<div class="flex gap-2">
			<Button disabled={data.isLocked} action={publish} size="sm" type={'button'} label="Publish" />
			{#if publishStatus.state}
				<Button
					action={unpublish}
					size="sm"
					className=" bg-destructive"
					type={'button'}
					label="Unpublish"
				/>
			{/if}
		</div>
	</div>
	<div class="flex h-6 justify-end gap-1 text-xs">
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
				class="variant-soft-success rounded-token flex items-center justify-end gap-1 px-4 py-2 text-xs"
			>
				<div class="inline-flex gap-1 text-destructive">
					Editing by {data.file.editingBy}
					<CloudAlert class="h-4 w-4" />
				</div>
			</div>
		{:else}
			<MarkdownEditor {carta} bind:value mode="tabs" />
			<div
				class="variant-soft-success rounded-token flex items-center justify-end gap-1 px-4 py-2 text-xs"
			>
				{#if !saveStatus.state}
					<div class="inline-flex gap-1 text-destructive">
						{saveStatus.updated}
						<CloudAlert class="h-4 w-4" />
					</div>
				{/if}
				{#if saveStatus.state}
					<div class="inline-flex gap-1">
						last save {saveStatus.updated}<Save class="h-4 w-4" />
					</div>
				{/if}
			</div>
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
