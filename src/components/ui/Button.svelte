<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		label?: string;
		icon?: any;
		action?: () => void;
		children?: () => any;
		light?: boolean;
		size?: 'sm' | 'md' | 'lg';
	}

	let {
		label = undefined,
		icon = null,
		action = undefined,
		children = undefined,
		light = false,
		size = 'md'
	}: Props = $props();

	const Icon = $derived(icon);
	let formattedLabel = $derived(label?.replace(/\s/g, '-').toLowerCase());
</script>

<button
	onclick={action}
	type="button"
	class={cn(
		'flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-2 text-background transition-all hover:scale-hover hover:drop-shadow-xl',
		{ 'border-2 bg-background text-text': light },
		{ 'h-8 w-8': size === 'sm' },
		{ 'h-10 w-10': size === 'md' },
		{ 'h-12 w-12': size === 'lg' },
		{ 'w-fit px-3': label }
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
