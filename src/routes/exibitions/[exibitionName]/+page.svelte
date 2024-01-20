<script lang="ts">
	export let data;
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
		<h1 class="text-8xl font-serif text-background">{data.meta.title}</h1>

		<!-- Tags -->
		<div class="flex gap-2">
			{#each data.meta.categories as category}
				<span class="surface-4">&num;{category}</span>
			{/each}
		</div>

		<!-- exibition -->
	</div>
	<div class="container mx-auto max-w-3xl content mb-10">
		<svelte:component this={data.content} />
	</div>
</section>
