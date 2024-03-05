<script lang="ts">
	import { slide } from 'svelte/transition';
	import { addFilterElement, entitiesForSearchBox } from '$stores/storeFilters';
	import { suggestions, inputValue } from '$stores/storeSearchSection';
	import { onMount } from 'svelte';

	let div: HTMLDivElement;

	const handleFilterFromSuggestion = (suggestion: any) => {
		addFilterElement(suggestion);
		$inputValue = '';
		$suggestions = [];
	};

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (div && !div.contains(event.target as Node)) {
				$suggestions = [];
			}
		};

		window.addEventListener('click', handleClickOutside);

		return () => {
			window.removeEventListener('click', handleClickOutside);
		};
	});
	$: console.log($suggestions);
</script>

{#if $suggestions && $suggestions.length > 0}
	<div
		bind:this={div}
		transition:slide
		class="z-10 mt-2 grid h-fit max-h-52 w-full grid-cols-1 gap-y-2 overflow-auto overscroll-auto rounded-xl border-2 bg-background p-2"
	>
		{#each $suggestions as suggestion}
			<div class="flex h-fit items-center gap-1">
				{#if $entitiesForSearchBox.length > 1}
					<div class="h-fit rounded-full border-2 border-text px-2 text-xs">
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
