<script lang="ts">
	let { selected, gallery } = $props();

	let caption = $derived(selected.caption || gallery.caption || gallery.title);
</script>

<div class="flex w-full flex-col items-center justify-center gap-4">
	<div class="relative size-full overflow-hidden rounded-lg">
		<img src={selected.src} alt={caption} class="absolute inset-0 size-full object-contain" />
	</div>
	{#if caption}<p>{@html caption}</p>{/if}
</div>
