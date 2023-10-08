<script lang="ts">
	import { createToggle, melt } from '@melt-ui/svelte';
	import { IsMethodFilterNOT, filters } from '$stores/storeFilters';

	const {
		elements: { root }
	} = createToggle({
		pressed: IsMethodFilterNOT
	});
</script>

{#if $filters.or && $filters.or.length > 0}
	<button
		use:melt={$root}
		aria-label="Toggle italic"
		class="group flex place-items-center items-center justify-center gap-1 pl-5 font-bold data-[disabled]:cursor-not-allowed"
	>
		<span class="text-secondary group-data-[state=on]:decoration-primary underline decoration-4"
			>OR</span
		>

		<span class="text-secondary group-data-[state=off]:decoration-primary underline decoration-4"
			>NOT</span
		>
	</button>
{/if}
