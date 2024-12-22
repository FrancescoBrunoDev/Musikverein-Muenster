<script lang="ts">
	import { LL } from '$lib/i18n/i18n-svelte';
	import type { LocalizedString } from 'typesafe-i18n';

	interface Props {
		options: { label: LocalizedString | string; value: string }[];
		active: string;
	}

	let { options, active = $bindable() }: Props = $props();
</script>

<div class="flex gap-2 rounded-xl bg-secondary p-2">
	{#each options as option}
		<button
			class="px-2 text-primary transition-colors"
			class:selected={active === option.value}
			onclick={() => (active = option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style>
	.selected {
		@apply rounded bg-background;
	}
</style>
