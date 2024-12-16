<script lang="ts">
	import { selectedGraphType } from '$stores/storeGraph';
</script>

<div class="flex gap-2 rounded-xl bg-border p-2">
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
