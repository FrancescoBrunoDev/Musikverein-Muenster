<script lang="ts">
	import { cn } from '$lib/utils';

	let { fallbackCaption, images, selected = $bindable() } = $props();
</script>

<div class="row-span-1 flex gap-2 overflow-x-scroll">
	{#each images as image, index}
		<button
			class="group relative h-full w-40 shrink-0 overflow-hidden rounded-lg transition-opacity"
			onclick={() => (selected = index)}
		>
			<img
				class={cn('h-full w-full object-cover transition-all duration-500 group-hover:scale-105', {
					'brightness-50': selected === index
				})}
				src={image.src}
				alt={image.caption || fallbackCaption}
			/>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="h-8 w-8 rounded-full bg-primary p-1 text-center text-background">
					{index + 1}
				</div>
			</div>
		</button>
	{/each}
</div>
