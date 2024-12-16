<script lang="ts">
	import { cn } from '$lib/utils';

	let { label = null, icon = null, action = null, children = null, light = false } = $props();

	const Icon = $derived(icon);
	let formattedLabel = $derived(label?.replace(/\s/g, '-').toLowerCase());
</script>

<button
	onclick={action}
	type="button"
	class={cn(
		'flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-background transition-all hover:scale-hover hover:drop-shadow-xl',
		{ 'px-3': label, 'w-10': !label },
		{ 'bg-background text-text': light }
	)}
	aria-label={formattedLabel}
>
	{#if label}
		<span
			class={cn('text-xs', {
				'text-base': !icon
			})}>{label}</span
		>
	{/if}
	<Icon />
	{@render children?.()}

	<span class="sr-only">Open Popover</span>
</button>
