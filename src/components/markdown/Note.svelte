<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	export let underlinedText: number;
	export let content: string;

	let isOpen: boolean = false;
</script>

<span class="relative">
	<span
		on:mouseenter={() => (isOpen = true)}
		on:mouseleave={() => (isOpen = false)}
		role="tooltip"
		class="cursor-help font-bold">{underlinedText}</span
	>
	{#if isOpen}
		<div
			class="absolute left-1/2 top-6 w-36 -translate-x-1/2 transform hyphens-auto rounded-xl bg-primary p-2 text-justify text-sm text-background transition-opacity duration-200"
			in:fly={{ y: 5, duration: 200 }}
			out:fade={{ duration: 200 }}
		>
			{content}
		</div>
	{/if}
</span>
