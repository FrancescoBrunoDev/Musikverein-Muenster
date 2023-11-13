<script lang="ts">
	import { createToggle, melt } from '@melt-ui/svelte';
	import { filters, filtersUrlified } from '$stores/storeFilters';
	import { Share } from 'lucide-svelte';

	function handleUrlifyFilters() {
		// make a function that takes the filters and returns a string
		// that can be used in the url
		// the string should be like this:
		// filtersOr=1,2,3&filtersAnd=4,5,6&filtersNot=7,8,9
		// if there are no filters, the string should be empty
		const filtersOr = $filters.or.map((filter) => filter.id).join(',');
		const filtersAnd = $filters.and.map((filter) => filter.id).join(',');
		const filtersNot = $filters.not.map((filter) => filter.id).join(',');
		const filtersString = `fo=${filtersOr}&fa=${filtersAnd}&fn=${filtersNot}`;
		$filtersUrlified = filtersString;
	}

	const {
		elements: { root }
	} = createToggle({
		onPressedChange: handleUrlifyFilters
	});
</script>

<button
	use:melt={$root}
	aria-label="Toggle italic"
	class="hover:scale-hover flex h-10 w-10 items-center justify-center rounded-xl bg-secondary transition-all hover:drop-shadow-xl dark:bg-primary"
    on:click={() => navigator.clipboard.writeText(`http://localhost:4200/timeline/${$filtersUrlified}`)}
>
	<Share />
</button>
