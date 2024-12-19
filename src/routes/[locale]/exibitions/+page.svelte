<script lang="ts">
	import * as config from '$lib/config';
	import { locale } from '$states/stateGeneral.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	$effect(() => {
		if (data.locale !== locale.current) {
			goto(`/${locale.current}/exibitions`);
		}
	});
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section class="container flex h-screen items-center">
	<ul class="flex flex-col gap-4">
		{#each data.exibitions as exibition}
			<li class="transition-transform duration-75 hover:-translate-y-1">
				<a
					href="/{locale.current}/exibitions/{exibition.slug}"
					class="text-4xl font-bold sm:text-6xl">{exibition.title}</a
				>
				<p class="description">{exibition.description}</p>
			</li>
		{/each}
	</ul>
</section>
