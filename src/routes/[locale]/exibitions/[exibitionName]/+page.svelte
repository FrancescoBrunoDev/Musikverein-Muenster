<script lang="ts">
	import { locale } from '$stores/storeGeneral';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let Markdown = $derived(data.content);

	$effect(() => {
		if (data.locale !== $locale) {
			goto(`/${$locale}/exibitions/${data.exibitionName}`);
		}
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<section>
	<!-- Title -->
	<div
		class="flex h-screen w-screen items-center bg-cover bg-center"
		style="background-image: url('{data.meta.img}')"
	>
		<div class="container">
			<h1 class="font-serif text-4xl text-background lg:text-8xl">{data.meta.title}</h1>

			<!-- Tags -->
			<div class="flex gap-2">
				{#each data.meta.categories as category}
					<span class="surface-4">&num;{category}</span>
				{/each}
			</div>
		</div>
		<!-- exibition -->
	</div>
	<div class="content container mx-auto mb-10 max-w-3xl">
		<Markdown />
	</div>
</section>
