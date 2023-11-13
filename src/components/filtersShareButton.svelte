<script lang="ts">
	import { createToggle, melt } from '@melt-ui/svelte';
	import { filtersUrlified, ulifyerFilters } from '$stores/storeFilters';
	import { Share } from 'lucide-svelte';

	const {
		elements: { root }
	} = createToggle({
		onPressedChange: ulifyerFilters
	});
	
</script>

<button
	use:melt={$root}
	aria-label="Toggle italic"
	class="hover:scale-hover flex h-10 w-10 items-center justify-center rounded-xl bg-secondary transition-all hover:drop-shadow-xl dark:bg-primary"
	on:click={() =>
		navigator.clipboard.writeText(`${window.location.origin}/timeline/${$filtersUrlified}`)}
>
	<Share />
</button>
