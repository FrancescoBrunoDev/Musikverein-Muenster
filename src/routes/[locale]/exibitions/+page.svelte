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

<section class="flex h-screen items-center">
	<ul>
		{#each data.exibitions as exibition}
			<li class="transition-transform duration-75 hover:-translate-y-1">
				<a href="/{$locale}/exibitions/{exibition.slug}" class="text-5xl font-bold"
					>{exibition.title}</a
				>
				<p class="description">{exibition.description}</p>
			</li>
		{/each}
	</ul>
</section>
