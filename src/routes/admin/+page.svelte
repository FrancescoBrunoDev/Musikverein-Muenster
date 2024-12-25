<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { locale } from '$states/stateGeneral.svelte';
	import DeleteExhibition from '$components/markdown/admin/DeleteExhibition.svelte';
	import Modal from '$components/ui/Modal.svelte';
	import { Settings2 } from 'lucide-svelte';
	import { formatData } from '$lib/utils';

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

	function openModalModifyExhibition(exhibition: any) {
		isModalModifyExhibitionOpen = {
			state: !isModalModifyExhibitionOpen.state,
			exhibition: exhibition
		};
	}
</script>

<div class="mt-10 flex flex-col gap-20">
	<div class="flex flex-wrap items-center gap-4">
		<h1 class="text-4xl font-bold sm:text-6xl">{$LL.commons.hallo()}, {data.user.name}</h1>
		<form action="?/logout" method="post" class="flex flex-col gap-4">
			<Button type="submit" size="sm" label={'Logout'}></Button>
		</form>
	</div>
	<div class="flex flex-col gap-4">
		<h2 class="text-4xl font-bold">{$LL.navbar.exhibitions()}</h2>
		<div class="flex flex-col gap-4">
			{#each data.exhibitions as exhibition}
				{@const formattedData = formatData({
					date: exhibition.updated,
					lang: $LL.commons.codeLang()
				})}
				<div
					class="flex flex-col justify-between gap-4 rounded-xl border-2 px-2 py-1 sm:flex-row sm:items-center"
				>
					<div class="flex flex-col gap-1 sm:flex-row sm:gap-8">
						<div>
							<p class="font-bold">{exhibition.title}</p>
							<p class="text-xs">{formattedData}</p>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							{#if exhibition.expand}
								{#each exhibition.expand.files as file}
									{@const isPublished = file.live ? ' - published' : ''}
									<p class="h-fit rounded-xl bg-secondary px-2 py-1 text-sm">
										{file.lang}
										{isPublished}
									</p>
								{/each}
							{:else}
								<span>no lang</span>
							{/if}
						</div>
					</div>
					<div class="flex flex-wrap gap-2 sm:flex-nowrap">
						<div class="flex gap-1">
							<Button
								href="/{locale.current}/preview/{exhibition.id}"
								label="Preview"
								className="px-4 w-fit"
								type="button"
								size="sm"
							/>
							<Button
								href="/admin/edit/{exhibition.id}/{exhibition.expand?.files[0].id}"
								label="Edit"
								className="px-4 w-fit"
								type="button"
								size="sm"
							/>
							<Button
								type="button"
								action={() => openModalModifyExhibition(exhibition)}
								size="sm"
								icon={Settings2}
							/>
						</div>
						<DeleteExhibition exhibitionId={exhibition.id}></DeleteExhibition>
					</div>
				</div>
			{/each}
			<Button
				type="button"
				action={() => (isModalNewExhibitionOpen = !isModalNewExhibitionOpen)}
				size="md"
				label="Add new exhibition"
			/>
		</div>
	</div>
</div>

<Modal isOpen={isModalNewExhibitionOpen}>
	<div class="max-h-[80dvh] overflow-y-auto rounded-xl bg-background dark:border-2">
		<h3 class="sticky top-0 mb-10 bg-background px-4 pb-0 pt-4 text-3xl font-bold">
			Create new exhibition
		</h3>
		<div>
			<form class="px-4 pb-4 flex flex-col gap-4" action="?/addNewExhibition" method="post">
				<input
					class="w-full p-2 rounded-xl border-2 bg-background"
					name="title"
					placeholder="Title"
				/>
				<Button type="submit" className="w-full" label="Add new exhibition" />
			</form>
		</div>
	</div>
</Modal>

<Modal isOpen={isModalModifyExhibitionOpen.state}>
	<div class="max-h-[80dvh] overflow-y-auto rounded-xl bg-background dark:border-2">
		<h3 class="sticky top-0 mb-10 bg-background px-4 pb-0 pt-4 text-3xl font-bold">
			Modify exhibition
		</h3>
		<div>
			<form class="px-4 pb-4 flex flex-col gap-4" action="?/modifyExhibition" method="post">
				<input
					class="w-full p-2 rounded-xl border-2 bg-background"
					name="title"
					placeholder="Title"
					value={isModalModifyExhibitionOpen.exhibition.title}
				/>
				<input type="hidden" name="id" value={isModalModifyExhibitionOpen.exhibition.id} />
				<Button type="submit" className="w-full" label="Modify exhibition" />
			</form>
		</div>
	</div>
</Modal>
