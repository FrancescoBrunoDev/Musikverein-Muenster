<script lang="ts">
	import { locale } from '$states/stateGeneral.svelte.js';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { ChevronLeft } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let Markdown = $derived(data.content);
	console.log(data);
	$effect(() => {
		if (data.locale !== locale.current && data.type !== 'preview') {
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
		<div class="fixed top-16 w-full container z-50 flex justify-between gap-4">
			<div class="flex gap-4">
				<Button type={'button'} className="px-4 w-fit" icon={ChevronLeft}
					><a href="/admin">back</a></Button
				>
				<!-- TODO: questo deve rimandare a /admin/edit/{data.exhibition?.id}/{file.id} -->
				<Button type={'button'} className="px-4 w-fit"
					><a href="/admin/edit/{data.exhibition?.id}/">Edit</a></Button
				>
			</div>
			<div class=" bg-background text-4xl font-bold rounded-lg px-2 dark:border-2 drop-shadow-xl">
				Preview {data.locale}
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
