<script lang="ts">
	import { Expand } from 'lucide-svelte';
	import GalleryOverlay from '$components/markdown/gallery/GalleryOverlay.svelte';
	import { cn } from '$lib/utils';

	let { gallery, className = '', style = {} } = $props();

	let isOpen = $state(false);
	let selected = $state(0);
	let isAnimating = $state(false);
	let coverLoaded: HTMLImageElement | null = $state(null);

	const handleClose = () => {
		isAnimating = false;
		// with a delay to allow the animation to finish
		setTimeout(() => {
			isOpen = false;
		}, 500);
	};

	$effect(() => {
		if (isOpen) {
			isAnimating = true;
		}
	});
</script>

<button
	onclick={() => (isOpen = true)}
	aria-label="Open Gallery"
	class={cn(
		'group relative w-full overflow-hidden rounded-lg transition-all dark:text-text text-background',
		className
	)}
	style={`
		${Object.entries(style)
			.map(([key, value]) => `${key}: ${value};`)
			.join(' ')}
		aspect-ratio: ${coverLoaded ? `${coverLoaded.naturalWidth} / ${coverLoaded.naturalHeight}` : 'auto'};
	`}
>
	<h4
		class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 p-4 text-xl font-bold opacity-0 transition-opacity group-hover:opacity-100"
	>
		<p>{@html gallery.title}</p>
		<Expand />
	</h4>
	<img
		src={gallery.cover}
		alt={gallery.title}
		onload={(e) => (coverLoaded = e.target as HTMLImageElement)}
		class="transition-all duration-500 group-hover:scale-105 group-hover:brightness-50"
	/>
</button>

<GalleryOverlay {isAnimating} {handleClose} {gallery} {selected} />
