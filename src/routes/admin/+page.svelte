<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { locale } from '$states/stateGeneral.svelte';
	import DeleteExhibition from '$components/markdown/admin/DeleteExhibition.svelte';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	async function handleNewExhibition() {
		const res = await fetch('/api/exhibitions/pb/addNewExhibition', {
			method: 'POST'
		});
		const result = await res.json();

		if (result.success) {
			// update the data.exhibitions array with the new exhibition
			await invalidateAll();
		} else {
			//TODO: ui missing
			console.error('Error adding new exhibition');
		}
	}
</script>

<div class="mt-10 flex flex-col gap-20">
	<div class="flex flex-wrap items-center gap-4">
		<h1 class="text-4xl font-bold sm:text-6xl">{$LL.commons.hallo()}, {data.user.name}</h1>
		<form action="?/logout" method="post" class="flex flex-col gap-4">
			<Button type="submit" label={'Logout'}></Button>
		</form>
	</div>
	<div class="flex flex-col gap-4">
		<h2 class="text-4xl font-bold">{$LL.navbar.exhibitions()}</h2>
		<div class="flex flex-col gap-4">
			{#each data.exhibitions as exhibition}
				{@const formattedData = new Date(exhibition.updated).toLocaleString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})}
				<div
					class="flex flex-col justify-between gap-4 rounded-xl border-2 p-2 sm:flex-row sm:items-center"
				>
					<div class="flex flex-col gap-1 sm:flex-row sm:gap-8">
						<div>
							<p class="font-bold">{exhibition.title}</p>
							<p class="text-sm">{formattedData}</p>
						</div>
						<div class="flex items-center gap-2">
							{#if exhibition.expand}
								{#each exhibition.expand.files as file}
									<p class="h-fit rounded-xl bg-secondary px-2 py-1 text-sm">
										{file.lang}
									</p>
								{/each}
							{:else}
								<span>no lang</span>
							{/if}
						</div>
					</div>
					<div class="flex flex-wrap gap-4">
						<div class="flex gap-1">
							<Button className="px-4 w-fit" type="button" size="sm"
								><a href="/{locale.current}/preview/{exhibition.id}">Preview</a></Button
							>
							<Button className="px-4 w-fit" type="button" size="sm"
								><a href="/admin/edit/{exhibition.id}/{exhibition.expand?.files[0].id}">Edit</a
								></Button
							>
						</div>
						<DeleteExhibition exhibitionId={exhibition.id}></DeleteExhibition>
					</div>
				</div>
			{/each}
			<Button type="button" action={handleNewExhibition} label={'Add new exhibition'}></Button>
		</div>
	</div>
</div>
