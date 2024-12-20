<script lang="ts">
	import * as config from '$lib/config';
	import { locale } from '$states/stateGeneral.svelte';
	import { goto } from '$app/navigation';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	$effect(() => {
		if (data.locale !== locale.current) {
			goto(`/${locale.current}/exhibitions`);
		}
	});
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section class="container flex h-screen items-center">
	<ul class="flex flex-col gap-4">
		{#each data.exhibitions as exhibition}
			<li class="transition-transform duration-75 hover:-translate-y-1">
				<a
					href="/{locale.current}/exhibitions/{exhibition.slug}"
					class="text-4xl font-bold sm:text-6xl">{exhibition.title}</a
				>
				<p class="description">{exhibition.description}</p>
			</li>
		{/each}
	</ul>
</section>
