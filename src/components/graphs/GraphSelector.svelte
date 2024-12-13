<script lang="ts">
	import { selectedGraphType } from '$stores/storeGraph';
	$inspect($selectedGraphType);
</script>

<div class="flex gap-2 bg-border p-2 rounded-xl">
	<button
		class="px-2 text-primary transition-colors"
		class:selected={$selectedGraphType === 'Line'}
		onclick={() => ($selectedGraphType = 'Line')}
	>
		Line
	</button>
	<button
		class="px-2 text-primary transition-colors"
		class:selected={$selectedGraphType === 'Map'}
		onclick={() => ($selectedGraphType = 'Map')}
	>
		Map
	</button>
</div>

<style>
	.selected {
		@apply rounded bg-background;
	}
</style>
