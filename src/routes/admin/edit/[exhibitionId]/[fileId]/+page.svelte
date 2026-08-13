<script lang="ts">
	import type { PageData } from './$types';
	import DOMPurify from 'isomorphic-dompurify';
	import { onMount } from 'svelte';
	import { Save, CloudAlert, CircleCheckBig, Undo2 } from 'lucide-svelte';
	import Button from '$components/ui/Button.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import Selector from '$components/ui/Selector.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { formatData } from '$lib/utils';

	import { Carta, MarkdownEditor, Markdown } from 'carta-md';
	// Component default theme
	import 'carta-md/default.css';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let value: string = $state(data.markdown ?? '');
	let lastSaved: string = data.markdown ?? '';
	let activeLang: string = $state(data.file?.lang ?? 'en');

	let saveStatus: { state: boolean; updated: string } = $state({
		state: false,
		updated: ''
	});
	let publishStatus: { state: boolean; updated: string } = $state({
		state: Boolean(data.file?.live),
		updated: data.file?.liveUpdated
			? formatData({ date: data.file.liveUpdated, lang: $LL.commons.codeLang() })
			: ''
	});
	let lockError: string = $state('');

	let options = $derived.by(() => {
		let items: { label: string; value: string; id: string }[] = [];
		data.exhibition?.expand?.files.forEach((item: { lang: any; id: any }) => {
			items.push({ label: item.lang, value: item.lang, id: item.id });
		});
		return items;
	});

	// Reset local editor state when the loaded file changes (e.g. language switch).
	let loadedFileId: string | undefined = data.file?.id;
	$effect(() => {
		if (data.file?.id !== loadedFileId) {
			loadedFileId = data.file?.id;
			value = data.markdown ?? '';
			lastSaved = data.markdown ?? '';
			activeLang = data.file?.lang ?? 'en';
			lockError = '';
			saveStatus = { state: false, updated: '' };
			publishStatus = {
				state: Boolean(data.file?.live),
				updated: data.file?.liveUpdated
					? formatData({ date: data.file.liveUpdated, lang: $LL.commons.codeLang() })
					: ''
			};
			if (!data.isLocked) claimLock();
		}
	});

	// Navigate only when the user actually switches language (not on initial mount).
	$effect(() => {
		if (activeLang !== data.file?.lang) {
			const fileId = options.find((item) => item.value === activeLang)?.id;
			if (fileId) goto(`/admin/edit/${data.exhibition?.id}/${fileId}`);
		}
	});

	onMount(() => {
		if (!data.isLocked) claimLock();
	});

	let debounceTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (!data.isLocked && !lockError && value !== lastSaved) {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				save();
			}, 1000);
		}
	});

	async function claimLock() {
		try {
			const res = await fetch('/api/exhibitions/pb/changeEditingBy', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: data.file?.id })
			});
			const result = await res.json();
			if (!result.success) {
				lockError = result.message ?? 'Unable to lock this file';
			}
		} catch (error) {
			console.error('Error while claiming lock:', error);
		}
	}

	async function save() {
		try {
			const res = await fetch('/api/exhibitions/pb/updateFile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: data.file?.id,
					markdown: value
				})
			});
			const result = await res.json();
			if (result.success) {
				lastSaved = value;
				saveStatus = {
					state: true,
					updated: formatData({
						date: result.updated?.previewUpdated ?? new Date().toISOString(),
						lang: $LL.commons.codeLang()
					})
				};
			} else {
				if (result.locked) lockError = result.message;
				saveStatus = { state: false, updated: result.message ?? 'Save failed' };
			}
		} catch (error) {
			console.error('Error while saving:', error);
			saveStatus = { state: false, updated: 'Save failed' };
		}
	}

	async function publish() {
		try {
			const res = await fetch('/api/exhibitions/pb/publishFile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: data.file?.id })
			});
			const result = await res.json();
			if (result.success) {
				publishStatus = {
					state: true,
					updated: formatData({
						date: result.updated?.liveUpdated ?? new Date().toISOString(),
						lang: $LL.commons.codeLang()
					})
				};
			} else {
				publishStatus = { state: false, updated: result.message ?? 'Publish failed' };
			}
		} catch (error) {
			console.error('Error while publishing:', error);
			publishStatus = { state: false, updated: 'Publish failed' };
		}
	}

	async function unpublish() {
		try {
			const res = await fetch('/api/exhibitions/pb/unpublishFile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: data.file?.id })
			});
			const result = await res.json();
			if (result.success) {
				publishStatus = { state: false, updated: '' };
			} else {
				publishStatus = { state: false, updated: result.message ?? 'Unpublish failed' };
			}
		} catch (error) {
			console.error('Error while unpublishing:', error);
			publishStatus = { state: false, updated: 'Unpublish failed' };
		}
	}

	async function revert() {
		try {
			const res = await fetch('/api/exhibitions/pb/revertFile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: data.file?.id })
			});
			const result = await res.json();
			if (result.success) {
				await invalidateAll();
			} else {
				lockError = result.message ?? 'Revert failed';
			}
		} catch (error) {
			console.error('Error while reverting:', error);
			lockError = 'Revert failed';
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
			{#if publishStatus.state}
				<Button
					action={revert}
					size="sm"
					className="bg-secondary text-text dark:bg-dark-secondary dark:text-dark-text"
					type={'button'}
					label="Revert to published"
					icon={Undo2}
				/>
			{/if}
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
			<span>not published yet</span>
		{/if}
	</div>
	{#if data.isLocked}
		<Markdown {value} {carta} />
	{:else}
		<MarkdownEditor {carta} bind:value mode="tabs" />
	{/if}
	<div
		class="variant-soft-success rounded-token flex items-center justify-end gap-1 px-4 py-2 text-xs"
	>
		{#if data.isLocked}
			<div class="text-destructive inline-flex gap-1">
				Editing by {data.file.editingBy}
				<CloudAlert class="h-4 w-4" />
			</div>
		{:else if lockError}
			<div class="text-destructive inline-flex gap-1">
				{lockError}
				<CloudAlert class="h-4 w-4" />
			</div>
		{:else if saveStatus.state}
			<div class="inline-flex gap-1">
				last save {saveStatus.updated}<Save class="h-4 w-4" />
			</div>
		{:else if saveStatus.updated}
			<div class="text-destructive inline-flex gap-1">
				{saveStatus.updated}
				<CloudAlert class="h-4 w-4" />
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$tailwind';

	:global(.carta-font-code) {
		font-family: 'Outfit';
	}
	:global(.carta-theme__default.carta-editor) {
		@apply border-border rounded-xl border-2;
	}
	:global(.carta-theme__default .carta-toolbar) {
		@apply border-border border-b-2 pt-2 pb-1;
	}
	:global(.carta-font-code) {
		@apply text-text;
	}
</style>
