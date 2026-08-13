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

	async function takeOver() {
		try {
			const res = await fetch('/api/exhibitions/pb/unlockFile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: data.file?.id })
			});
			const result = await res.json();
			if (result.success) {
				await invalidateAll();
			} else {
				lockError = result.message ?? 'Unable to take over editing';
			}
		} catch (error) {
			console.error('Error while taking over editing:', error);
			lockError = 'Unable to take over editing';
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

<div class="flex h-[calc(100dvh_-_2.5rem)] flex-col">
	<header class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-4">
			<Button
				href="/admin"
				label={$LL.admin.back()}
				type={'button'}
				size="sm"
				className="pr-4 w-fit"
				icon={ChevronLeft}
			/>
			<Button
				href="/{activeLang}/preview/{data.exhibition?.id}"
				target="_blank"
				label={$LL.admin.preview()}
				type={'button'}
				size="sm"
				className="px-4 w-fit"
			/>
			<Selector {options} bind:active={activeLang} />
		</div>
		<div class="flex flex-wrap items-center justify-end gap-2">
			{#if data.isLocked}
				<Button
					action={takeOver}
					size="sm"
					className="bg-secondary text-text dark:bg-dark-secondary dark:text-dark-text"
					type={'button'}
					label={$LL.admin.takeOverEditing()}
				/>
			{/if}
			{#if publishStatus.state}
				<Button
					action={revert}
					size="sm"
					className="bg-secondary text-text dark:bg-dark-secondary dark:text-dark-text"
					type={'button'}
					label={$LL.admin.revertToPublished()}
					icon={Undo2}
				/>
			{/if}
			<Button
				disabled={data.isLocked}
				action={publish}
				size="sm"
				type={'button'}
				label={$LL.admin.publish()}
			/>
			{#if publishStatus.state}
				<Button
					action={unpublish}
					size="sm"
					className=" bg-destructive"
					type={'button'}
					label={$LL.admin.unpublish()}
				/>
			{/if}
		</div>
	</header>
	<div class="mt-3 flex min-h-0 flex-1 flex-col">
		{#if data.isLocked}
			<Markdown {value} {carta} />
		{:else}
			<MarkdownEditor {carta} bind:value mode="auto" />
		{/if}
	</div>
	<div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-2 py-2 text-xs">
		<div class="flex min-w-0 items-center gap-1">
			{#if data.isLocked}
				<span class="text-destructive inline-flex items-center gap-1">
					{$LL.admin.editingBy()}
					{data.file.editingBy}
					<CloudAlert class="h-4 w-4" />
				</span>
			{:else if lockError}
				<span class="text-destructive inline-flex items-center gap-1">
					{lockError}
					<CloudAlert class="h-4 w-4" />
				</span>
			{:else if saveStatus.state}
				<span class="inline-flex items-center gap-1">
					{$LL.admin.lastSave()}
					{saveStatus.updated}<Save class="h-4 w-4" />
				</span>
			{:else if saveStatus.updated}
				<span class="text-destructive inline-flex items-center gap-1">
					{saveStatus.updated}
					<CloudAlert class="h-4 w-4" />
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-1">
			{#if publishStatus.state}
				<CircleCheckBig class="h-4 w-4" />
				<span>{$LL.admin.lastPublish()} {publishStatus.updated}</span>
			{:else}
				<span>{$LL.admin.notPublishedYet()}</span>
			{/if}
		</div>
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

	/* Fill the available editor area instead of the fixed 600px default. */
	:global(.carta-editor) {
		flex: 1 1 auto;
		min-height: 0;
	}
	:global(.carta-wrapper) {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		min-height: 0;
	}
	:global(.carta-container) {
		flex: 1 1 auto;
		min-height: 0;
	}
	/* The library default sets a fixed 600px height; let the flex layout size it. */
	:global(.carta-input),
	:global(.carta-renderer) {
		height: auto !important;
		min-height: 0;
	}
	:global(.carta-viewer) {
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;
	}
</style>
