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
	console.log(data);
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
		<div class="container fixed top-16 z-50 flex w-full justify-between gap-4">
			<div class="flex gap-4">
				<Button type={'button'} className="px-4 w-fit" icon={ChevronLeft}
					><a href="/admin">back</a></Button
				>
				<Button type={'button'} className="px-4 w-fit"
					><a href="/admin/edit/{data.exhibition?.id}/{data.fileObj?.id}">Edit</a></Button
				>
			</div>
			<div class=" rounded-lg bg-background px-2 text-4xl font-bold drop-shadow-xl dark:border-2">
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
