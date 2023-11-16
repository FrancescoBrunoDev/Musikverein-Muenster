<script lang="ts">
	export let data;
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<section class="flex h-screen items-center">
	<div class="flex flex-col">
		<!-- Title -->
		<hgroup class="text-4xl">
			<h1>{data.meta.title}</h1>
		</hgroup>

		<!-- Tags -->
		<div class="flex gap-2">
			{#each data.meta.categories as category}
				<span class="surface-4">&num;{category}</span>
			{/each}
		</div>

		<!-- exibition -->
		<div class="prose">
			<svelte:component this={data.content} />
		</div>
	</div>
</section>
