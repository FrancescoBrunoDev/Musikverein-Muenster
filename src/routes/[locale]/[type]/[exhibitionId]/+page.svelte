<script lang="ts">
	import { locale } from '$states/stateGeneral.svelte.js';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { ChevronLeft, RefreshCw } from 'lucide-svelte';
	import Selector from '$components/ui/Selector.svelte';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let Markdown = $derived(data.content);
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
			goto(`/${locale.current}/${data.type}/${data.exhibitionId}`);
		}
	});
	$effect(() => {
		goto(`/${activeLang}/preview/${data.exhibitionId}`);
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
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
			style="background-image: url('{data.meta.img}')"
		>
			<div class="container">
				<h1 class="font-serif text-4xl text-background lg:text-8xl">{data.meta.title}</h1>
			</div>
		</div>
		<div class="content container mx-auto mb-10 max-w-3xl">
			<Markdown />
		</div>
	{:else}
		<div>Loading</div>
	{/if}
</section>
