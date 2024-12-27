<script lang="ts">
	import { locale } from '$states/stateGeneral.svelte.js';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { ChevronLeft, RefreshCw } from 'lucide-svelte';
	import Selector from '$components/ui/Selector.svelte';
	import { invalidateAll } from '$app/navigation';
	import { Carta, Markdown } from 'carta-md';
	import Image from '$components/markdown/gallery/Img.svelte';
	import DOMPurify from 'isomorphic-dompurify';
	import { onMount } from 'svelte';
	import { mount } from 'svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let value = $derived(data.markdown.content);

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let options = $derived.by(() => {
		let items: { label: string; value: string; id: string }[] = [];
		data.exhibition?.expand?.files.forEach((item: { lang: any; id: any }) => {
			items.push({ label: item.lang, value: item.lang, id: item.id });
		});
		return items;
	});
	let activeLang = $state(data.locale || 'en');

	$effect(() => {
		if (data.locale !== locale.current && data.type !== 'preview') {
			goto(`/${locale.current}/${data.type}/${data.exhibition.id}`);
		} else if (data.type === 'preview') {
			goto(`/${activeLang}/preview/${data.exhibition.id}`);
		}
	});

	onMount(() => {
		const markdown = document.querySelector('.carta-viewer');
		if (markdown) {
			const imgs = markdown.querySelectorAll('img');
			imgs.forEach((img) => {
				const src = img.getAttribute('src');
				const props = { src: String(src) };
				const div = document.createElement('div');
				mount(Image, { target: div, props });
				img.replaceWith(div);
			});
		}
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.markdown.metadata.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.markdown.metadata.title} />
</svelte:head>

<section>
	{#if data}
		{#if data.type === 'preview'}
			<div class="container fixed top-16 z-50 w-full">
				<div
					class="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-2 backdrop-blur-xl"
				>
					<div class="flex gap-4">
						<Button
							href="/admin"
							type={'button'}
							size="sm"
							className="pr-4 w-fit"
							icon={ChevronLeft}
							label="back"
						/>
						<Button
							href="/admin/edit/{data.exhibition?.id}/{data.fileObj?.id}"
							type={'button'}
							label="Edit"
							size="sm"
							className="px-4 w-fit"
						/>
						<Button
							icon={RefreshCw}
							action={async () => await invalidateAll()}
							type={'button'}
							size="sm"
						/>
					</div>
					<Selector bind:active={activeLang} {options} />
				</div>
			</div>
		{/if}
		<div
			class="flex h-screen w-screen items-center bg-cover bg-center"
			style="background-image: url('{data.markdown.metadata.img}')"
		>
			<div class="container">
				<h1 class="font-serif text-4xl text-background lg:text-8xl">
					{data.markdown.metadata.title}
				</h1>
			</div>
		</div>
		<div class="container mx-auto my-10 prose max-w-3xl dark:text-text">
			{#key value}
				<Markdown {value} {carta} />
			{/key}
		</div>
	{:else}
		<div>Loading</div>
	{/if}
</section>
