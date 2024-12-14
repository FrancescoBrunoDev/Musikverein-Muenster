<script lang="ts">
	import { X, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import View from '$components/markdown/gallery/View.svelte';
	import Preview from '$components/markdown/gallery/Preview.svelte';
	import { onMount, onDestroy } from 'svelte';

	let { isAnimating, handleClose, gallery, selected } = $props();

	let ref: Node | null = $state(null);
	let portal: HTMLDivElement | null = $state(null);
	let images = $derived(
		gallery.images && gallery.images.length > 0
			? gallery.images
			: [
					{
						src: gallery.cover,
						caption: gallery.caption || gallery.title
					}
				]
	);

	onMount(() => {
		// Search for existing portal
		const existingPortal = document.querySelector('.gallery-portal');

		if (existingPortal) {
			// Use the existing portal if it exists
			portal = existingPortal as HTMLDivElement;
		} else {
			// Create a new portal if it doesn't exist
			portal = document.createElement('div');
			portal.className = 'gallery-portal';
			document.body.appendChild(portal);
		}

		// Append the ref to the portal
		if (ref) {
			portal.appendChild(ref);
		}
	});

	onDestroy(() => {
		if (portal) {
			document.body.removeChild(portal);
		}
	});
</script>

<div
	bind:this={ref}
	class={cn(
		'fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 text-primary',
		'transition-all duration-300',
		{
			'translate-y-0 scale-100 opacity-100 backdrop-blur-xl': isAnimating,
			'translate-y-5 scale-95 opacity-0 backdrop-blur-0 pointer-events-none': !isAnimating
		}
	)}
>
	<div
		class="mx-auto flex w-screen flex-col items-center px-4 py-12 md:px-12 md:py-12 relative h-full dark:text-text text-background"
	>
		<button class="absolute right-4 top-4" onclick={handleClose}>
			<X />
		</button>
		<div class="grid size-full grid-cols-1 grid-rows-6 justify-center gap-4">
			<div
				class={cn('flex', {
					'row-span-6': images.length === 1,
					'row-span-5': images.length > 1
				})}
			>
				{#if images.length > 1}
					<button
						onclick={() => (selected = selected - 1)}
						disabled={selected === 0}
						class="disabled:opacity-50"
					>
						<ChevronLeft class="h-10 w-10" />
					</button>
				{/if}
				<View selected={images[selected]} {gallery} />{' '}
				{#if images.length > 1}
					<button
						onclick={() => (selected = selected + 1)}
						disabled={selected === images.length - 1}
						class="disabled:opacity-50"
					>
						<ChevronRight class="h-10 w-10" />
					</button>
				{/if}
			</div>
			{#if images.length > 1}
				<Preview fallbackCaption={gallery.caption || gallery.title} {images} bind:selected />
			{/if}
		</div>
	</div>
</div>
