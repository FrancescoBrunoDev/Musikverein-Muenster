<script lang="ts">
	import { slide } from 'svelte/transition';
	import { addFilterElement, entitiesForSearchBox } from '$stores/storeFilters';

	export let suggestions: AutocompleteResult[];
	export let inputValue;

	const handleFilterFromSuggestion = (suggestion: any) => {
		addFilterElement(suggestion);
		suggestions = [];
		inputValue = '';
	};
</script>

{#if suggestions && suggestions.length > 0}
	<div
		transition:slide
		class="z-10 mt-2 grid max-h-64 w-full grid-cols-1 gap-y-2 overflow-auto overscroll-auto rounded-xl border bg-background p-2 dark:bg-primary dark:text-secondary"
	>
		{#each suggestions as suggestion}
			<div class="flex items-center gap-1">
				{#if $entitiesForSearchBox.length > 1}
					<div
						class="h-fit rounded-full border-2 border-primary px-2 text-xs dark:border-secondary"
					>
						{suggestion[1]}
					</div>
				{/if}

				<button
					class="text-left"
					on:click={() => handleFilterFromSuggestion({ suggestion })}
					id={suggestion[2]}>{suggestion[0]}</button
				>
			</div>
		{/each}
	</div>
{/if}
