<script lang="ts">
	import type { LocalizedString } from 'typesafe-i18n';

	interface Props {
		options: { label: LocalizedString | string; value: string }[];
		active: string;
	}

	let { options, active = $bindable() }: Props = $props();
</script>

<div class="flex gap-2 rounded-2xl bg-secondary p-1">
	{#each options as option}
		<button
			class="px-2 text-primary transition-all"
			class:selected={active === option.value}
			onclick={() => (active = option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style lang="postcss">
	@reference '../../app.css';
	.selected {
		@apply bg-background rounded-xl;
	}
</style>
