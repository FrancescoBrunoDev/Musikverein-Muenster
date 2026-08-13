<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { locale } from '$states/stateGeneral.svelte';
	import DeleteExhibition from '$components/markdown/admin/DeleteExhibition.svelte';
	import Modal from '$components/ui/Modal.svelte';
	import { GripVertical, Settings2 } from 'lucide-svelte';
	import { formatData } from '$lib/utils';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
	let isModalNewExhibitionOpen = $state(false);
	let isModalModifyExhibitionOpen = $state({
		state: false,
		exhibition: {
			id: '',
			title: ''
		}
	});

	let exhibitions = $state(data.exhibitions);
	let draggedId = $state<string | null>(null);

	$effect(() => {
		exhibitions = data.exhibitions;
	});

	function openModalModifyExhibition(exhibition: any) {
		isModalModifyExhibitionOpen = {
			state: !isModalModifyExhibitionOpen.state,
			exhibition: exhibition
		};
	}

	function onDragStart(event: DragEvent, id: string) {
		draggedId = id;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	function onDrop(event: DragEvent, targetId: string) {
		event.preventDefault();
		const fromId = draggedId;
		draggedId = null;
		if (!fromId || fromId === targetId) return;

		const fromIndex = exhibitions.findIndex((item) => item.id === fromId);
		const toIndex = exhibitions.findIndex((item) => item.id === targetId);
		if (fromIndex < 0 || toIndex < 0) return;

		const next = [...exhibitions];
		const [moved] = next.splice(fromIndex, 1);
		next.splice(toIndex, 0, moved);
		exhibitions = next;
		persistOrder();
	}

	async function persistOrder() {
		try {
			const res = await fetch('/api/exhibitions/pb/reorderExhibitions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ids: exhibitions.map((item) => item.id) })
			});
			const result = await res.json();
			if (!result.success) {
				await invalidateAll();
			}
		} catch (error) {
			console.error('Error while reordering:', error);
			await invalidateAll();
		}
	}
</script>

<div class="flex flex-col gap-10">
	<div class="flex flex-wrap items-center gap-4">
		<h1 class="text-4xl font-bold sm:text-6xl">{$LL.commons.hallo()}, {data.user.name}</h1>
		<form action="?/logout" method="post">
			<Button type="submit" size="sm" label={$LL.admin.logout()}></Button>
		</form>
	</div>
	<div class="flex flex-col gap-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 class="text-4xl font-bold">{$LL.navbar.exhibitions()}</h2>
			<Button
				type="button"
				action={() => (isModalNewExhibitionOpen = !isModalNewExhibitionOpen)}
				size="md"
				label={$LL.admin.addNewExhibition()}
			/>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each exhibitions as exhibition}
				{@const formattedData = formatData({
					date: exhibition.updated,
					lang: $LL.commons.codeLang()
				})}
				<article
					class="flex flex-col gap-4 rounded-xl border-2 p-4"
					class:opacity-50={draggedId === exhibition.id}
					draggable="true"
					ondragstart={(event) => onDragStart(event, exhibition.id)}
					ondragover={onDragOver}
					ondrop={(event) => onDrop(event, exhibition.id)}
					ondragend={() => (draggedId = null)}
				>
					<div class="flex items-start justify-between gap-2">
						<div class="min-w-0">
							<h3 class="font-bold break-words">{exhibition.title}</h3>
							<p class="text-xs">{formattedData}</p>
						</div>
						<span class="cursor-grab text-secondary" aria-hidden="true" title="Drag to reorder">
							<GripVertical class="h-4 w-4" />
						</span>
					</div>
					<div class="flex flex-wrap items-center gap-2">
						{#if exhibition.expand}
							{#each exhibition.expand.files as file}
								{@const isPublished = file.live ? $LL.admin.publishedSuffix() : ''}
								<p class="bg-secondary dark:bg-dark-secondary h-fit rounded-lg px-2.5 py-1 text-xs">
									{file.lang}
									{isPublished}
								</p>
							{/each}
						{:else}
							<span>{$LL.admin.noLang()}</span>
						{/if}
					</div>
					<div class="mt-auto flex flex-wrap items-center gap-2 border-t-2 pt-3">
						<Button
							href="/{locale.current}/preview/{exhibition.id}"
							label={$LL.admin.preview()}
							className="px-4 w-fit"
							type="button"
							size="sm"
						/>
						<Button
							href="/admin/edit/{exhibition.id}/{exhibition.expand?.files[0].id}"
							label={$LL.admin.edit()}
							className="px-4 w-fit"
							type="button"
							size="sm"
						/>
						<Button
							type="button"
							action={() => openModalModifyExhibition(exhibition)}
							size="sm"
							icon={Settings2}
							ariaLabel={$LL.admin.modifyExhibition()}
						/>
						<DeleteExhibition exhibitionId={exhibition.id}></DeleteExhibition>
					</div>
				</article>
			{/each}
		</div>
	</div>
</div>

<Modal isOpen={isModalNewExhibitionOpen}>
	<div
		class="bg-background dark:bg-dark-background max-h-[80dvh] overflow-y-auto rounded-xl dark:border-2"
	>
		<h3
			class="bg-background dark:bg-dark-background sticky top-0 mb-4 px-4 pt-4 pb-0 text-3xl font-bold"
		>
			{$LL.admin.createNewExhibition()}
		</h3>
		<div>
			<form class="flex flex-col gap-4 px-4 pb-4" action="?/addNewExhibition" method="post">
				<input
					class="bg-background dark:bg-dark-background w-full rounded-xl border-2 px-3 py-2"
					name="title"
					placeholder={$LL.admin.title()}
				/>
				<Button type="submit" className="w-full" label={$LL.admin.addNewExhibition()} />
			</form>
		</div>
	</div>
</Modal>

<Modal isOpen={isModalModifyExhibitionOpen.state}>
	<div
		class="bg-background dark:bg-dark-background max-h-[80dvh] overflow-y-auto rounded-xl dark:border-2"
	>
		<h3
			class="bg-background dark:bg-dark-background sticky top-0 mb-4 px-4 pt-4 pb-0 text-3xl font-bold"
		>
			{$LL.admin.modifyExhibition()}
		</h3>
		<div>
			<form class="flex flex-col gap-4 px-4 pb-4" action="?/modifyExhibition" method="post">
				<input
					class="bg-background dark:bg-dark-background w-full rounded-xl border-2 px-3 py-2"
					name="title"
					placeholder={$LL.admin.title()}
					value={isModalModifyExhibitionOpen.exhibition.title}
				/>
				<input type="hidden" name="id" value={isModalModifyExhibitionOpen.exhibition.id} />
				<Button type="submit" className="w-full" label={$LL.admin.modifyExhibition()} />
			</form>
		</div>
	</div>
</Modal>
