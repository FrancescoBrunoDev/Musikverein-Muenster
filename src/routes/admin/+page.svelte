<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { LL } from '$lib/i18n/i18n-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	$inspect(data);
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
				<div class="flex gap-4">
					<p>{exhibition.title}</p>
					<p>{exhibition.date}</p>
					<p>{exhibition.location}</p>
					<p>{exhibition.description}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
