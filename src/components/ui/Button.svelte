<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		label = null,
		icon = null,
		action = null,
		children = null,
		light = false,
		size = 'md'
	} = $props();

	const Icon = $derived(icon);
	let formattedLabel = $derived(label?.replace(/\s/g, '-').toLowerCase());
</script>

<button
	onclick={action}
	type="button"
	class={cn(
		'flex p-2 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-background transition-all hover:scale-hover hover:drop-shadow-xl',
		{ 'bg-background text-text border-2': light },
		{ 'w-8 h-8': size === 'sm' },
		{ 'w-10 h-10': size === 'md' },
		{ 'w-12 h-12': size === 'lg' },
		{ 'px-3 w-fit': label }
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
	<Icon class={cn('stroke-2')} />
	{@render children?.()}

	<span class="sr-only">Open Popover</span>
</button>
