<script lang="ts">
	import * as config from '$lib/config';
	import { locale } from '$stores/storeGeneral';
	import { goto } from '$app/navigation';

	let { data } = $props();

	$effect(() => {
		if (data.locale !== $locale) {
			goto(`/${$locale}/exibitions`);
		}
	});
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section class="flex h-screen items-center container">
	<ul class="flex gap-4 flex-col">
		{#each data.exibitions as exibition}
			<li class="transition-transform duration-75 hover:-translate-y-1">
				<a href="/{$locale}/exibitions/{exibition.slug}" class="sm:text-6xl text-4xl font-bold"
					>{exibition.title}</a
				>
				<p class="description">{exibition.description}</p>
			</li>
		{/each}
	</ul>
</section>
