<script lang="ts">
	import { selectedGraphType } from '$stores/storeGraph';
	import { LL } from '$lib/i18n/i18n-svelte';
</script>

<div class="flex gap-2 rounded-xl bg-border p-2">
	<button
		class="px-2 text-primary transition-colors"
		class:selected={$selectedGraphType === 'Line'}
		onclick={() => ($selectedGraphType = 'Line')}
	>
		{$LL.graphs.line()}
	</button>
	<button
		class="px-2 text-primary transition-colors"
		class:selected={$selectedGraphType === 'Map'}
		onclick={() => ($selectedGraphType = 'Map')}
	>
		{$LL.graphs.map()}
	</button>
</div>

<style>
	.selected {
		@apply rounded bg-background;
	}
</style>
