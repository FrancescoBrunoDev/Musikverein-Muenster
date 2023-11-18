<script lang="ts">
	import * as config from '$lib/config';
	export let data;
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section class="flex h-screen items-center">
	<ul>
		{#each data.exibitions as exibition}
			<li class="post">
				<a href="/exibitions/{exibition.slug}" class="text-5xl">{exibition.title}</a>
				<p class="description">{exibition.description}</p>
			</li>
		{/each}
	</ul>
</section>
