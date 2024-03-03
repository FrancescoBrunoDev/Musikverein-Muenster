<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ChevronRight, ChevronLeft, Maximize2 } from 'lucide-svelte';
	import Modal from '$components/Modal.svelte';
	import { showModal } from '$stores/storeGeneral';

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
		$showModal = true;
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
		} else if (event.key === 'ArrowRight') {
			navigation('right');
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

<Modal>
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
		<img class="rounded-xl drop-shadow-lg" src={images[indexGallery]} alt={images[indexGallery]} />
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
</Modal>
