<script lang="ts">
	import { locale } from '$states/stateGeneral.svelte.js';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let Markdown = $derived(data.content);

	$effect(() => {
		if (data.locale !== locale.current) {
			goto(`/${locale.current}/${data.type}/${data.exhibitionId}`);
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
	{#if data.type === 'preview'}
		<div class="fixed top-20 right-10 z-50">
			<div
				class=" bg-background text-4xl font-bold rounded-lg px-2 mx-auto dark:border-2 drop-shadow-xl"
			>
				Preview
			</div>
		</div>
	{/if}
	<div
		class="flex h-screen w-screen items-center bg-cover bg-center"
		style="background-image: url('{data.meta.img}')"
	>
		<div class="container">
			<h1 class="font-serif text-4xl text-background lg:text-8xl">{data.meta.title}</h1>
		</div>
	</div>
	<div class="content container mx-auto mb-10 max-w-3xl">
		<Markdown />
	</div>
</section>
