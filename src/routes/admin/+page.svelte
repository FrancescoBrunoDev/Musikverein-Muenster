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
		console.log(result);

		if (result.success) {
			// update the data.exhibitions array with the new exhibition
			await invalidateAll();
		} else {
			//TODO: ui missing
			console.error('Error adding new exhibition');
		}
	}
</script>

<div class="mt-10 flex-col gap-20 flex">
	<div class="flex gap-4 items-center flex-wrap">
		<h1 class="sm:text-6xl text-4xl font-bold">{$LL.commons.hallo()}, {data.user.name}</h1>
		<form action="?/logout" method="post" class="flex flex-col gap-4">
			<Button type="submit" label={'Logout'}></Button>
		</form>
	</div>
	<div class="flex gap-4 flex-col">
		<h2 class="text-4xl font-bold">{$LL.navbar.exhibitions()}</h2>
		<div class="flex gap-4 flex-col">
			{#each data.exhibitions as exhibition}
				{@const formattedData = new Date(exhibition.updated).toLocaleString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})}
				<div
					class="flex gap-4 sm:items-center border-2 p-4 rounded-xl justify-between flex-col sm:flex-row"
				>
					<div class="flex gap-1 sm:gap-4 flex-col sm:flex-row">
						<div class="flex sm:gap-4 flex-col sm:flex-row">
							<p class=" font-bold">{exhibition.title}</p>
							<p>{formattedData}</p>
						</div>
						<div class="flex gap-2 items-center">
							{#if exhibition.expand}
								{#each exhibition.expand.files as file}
									<p class="text-sm">
										{file.lang}
									</p>
								{/each}
							{:else}
								<span>no lang</span>
							{/if}
						</div>
					</div>
					<div class="flex gap-4 flex-wrap">
						<div class="flex gap-1">
							<Button className="px-4 w-fit" type="button" size="sm"
								><a href="/{locale.current}/preview/{exhibition.id}">Preview</a></Button
							>
							<Button className="px-4 w-fit" type="button" size="sm"
								><a href="/admin/edit/{exhibition.id}/{exhibition.expand.files[0].id}">Edit</a
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
