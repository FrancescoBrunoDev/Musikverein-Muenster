<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ChevronRight, ChevronLeft, Minimize2, Maximize2 } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';

	export let title: string;
	export let gallery: string;
	export let size: string = 'w-full';

	let images: string[] = [];
	let isGalleryOpen = false;
	let indexGallery = 0;

	onMount(async () => {
		indexGallery = 0;
		const formattedTitle = title.replace(/\s/g, '_').toLowerCase();
		const formattedGallery = gallery.replace(/\s/g, '_').toLowerCase();
		console.log(title);
		const imgUrls = await fetch(
			`/api/exibitions/getGalleryImgUrls/${formattedTitle}/${formattedGallery}`
		);

		const imgUrlsJson = await imgUrls.json();
		images = imgUrlsJson;
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
	});

	function handleClick() {
		isGalleryOpen = true;
	}
	function closeGallery() {
		isGalleryOpen = false;
	}
	function navigation(direction: 'left' | 'right') {
		if (direction === 'left') {
			if (indexGallery === 0) {
				indexGallery = images.length - 1;
			} else {
				indexGallery--;
			}
		} else {
			if (indexGallery === images.length - 1) {
				indexGallery = 0;
			} else {
				indexGallery++;
			}
		}
	}
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			navigation('left');
		}
		if (event.key === 'ArrowRight') {
			navigation('right');
		} else if (event.key === 'Escape') {
			closeGallery();
		}
	}
</script>

<button
	on:click={handleClick}
	class="{size} group grid justify-items-stretch overflow-hidden rounded-xl"
>
	<div
		class="absolute mx-auto flex items-center gap-1 place-self-center rounded-xl bg-background p-2 transition-all hover:drop-shadow-xl group-hover:scale-hover"
	>
		<Maximize2 size={18} />
		<p class="text-sm">Open the gallery</p>
	</div>
	<img src={images[0]} alt={images[0]} />
</button>
{#if isGalleryOpen}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-blur backdrop-brightness-75"
	>
		<div
			in:fly={{ y: 100, duration: 400, easing: cubicOut }}
			out:fly={{ y: -50, duration: 300, easing: cubicIn }}
			class="z-10 grid w-full justify-items-stretch gap-2 px-2 md:w-3/4 md:px-0"
		>
			<button
				on:click={closeGallery}
				class="flex h-8 w-8 items-center justify-center justify-self-end rounded-xl bg-background p-2 transition-all hover:scale-hover hover:drop-shadow-xl"
			>
				<Minimize2 />
			</button>
			<div class="relative">
				<button
					on:click={() => navigation('right')}
					class="absolute right-0 z-20 h-full transition-all hover:scale-hover hover:drop-shadow-xl"
				>
					<ChevronRight size={40} />
				</button>
				<button
					on:click={() => navigation('left')}
					class="absolute left-0 z-20 h-full transition-all hover:scale-hover hover:drop-shadow-xl"
				>
					<ChevronLeft size={40} />
				</button>
				<img
					class="rounded-xl drop-shadow-lg"
					src={images[indexGallery]}
					alt={images[indexGallery]}
				/>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each images as image}
					{#if image === images[indexGallery]}
						<button
							on:click={() => {
								indexGallery = images.indexOf(image);
							}}
							class="rounded-lg drop-shadow-xl"
						>
							<img class="h-10 rounded-lg" src={image} alt={image} loading="lazy" />
						</button>
					{:else}
						<button
							on:click={() => {
								indexGallery = images.indexOf(image);
							}}
							class="rounded-lg brightness-50"
						>
							<img class="h-10 rounded-lg" src={image} alt={image} loading="lazy" />
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}
