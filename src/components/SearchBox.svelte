<script lang="ts">
	import { autocomplete } from '$lib/dataMusiconn';
	import { slide } from 'svelte/transition';
	import {
		addFilterElement,
		updateEntitiesForSearchBox,
		entitiesForSearchBox
	} from '$stores/storeGraph';

	let suggestions: AutocompleteResult[] = [];
	let inputValue = '';

	const handleInput = (query: string) => {
		const value = query;
		if (value.length > 0) {
			autocomplete(value).then((response) => {
				suggestions = response;
			});
		} else {
			suggestions = [];
		}
	};

	const handleFilterFromSuggestion = (suggestion) => {
		addFilterElement(suggestion);
		suggestions = [];
		inputValue = ''; // Clear the input field
	};
	const Entities = ['person', 'work', 'corporation'];
</script>

<input
	class="focus:shadow-outline text-secondary bg-primary placeholder-background h-10 w-full rounded-full px-3 text-base drop-shadow-lg"
	type="text"
	id="myInput"
	bind:value={inputValue}
	on:input={(input) => handleInput(input.target.value)}
	placeholder="Search"
/>
<div class="my-2 flex gap-2 pl-2">
	{#each Entities as entity}
		<button
			on:click={() => {
				updateEntitiesForSearchBox(entity);
				handleInput(inputValue);
			}}
			class={'rounded-full px-4 pb-[0.15rem] text-sm transition-shadow hover:drop-shadow-lg ' +
				($entitiesForSearchBox.includes(entity)
					? 'bg-primary text-secondary'
					: 'bg-secondary text-primary')}
		>
			{entity}
		</button>
	{/each}
</div>
{#if suggestions && suggestions.length > 0}
	<div
		transition:slide
		class="bg-background dark:bg-primary dark:text-secondary z-10 mt-2 grid max-h-64 w-full grid-cols-1 gap-y-2 overflow-auto overscroll-auto rounded-xl border p-2"
	>
		{#each suggestions as suggestion}
			<div class="flex items-center gap-1">
				{#if $entitiesForSearchBox.length > 1}
					<div
						class="border-primary dark:border-secondary h-fit rounded-full border-2 px-2 text-xs"
					>
						{suggestion[1]}
					</div>
				{/if}

				<button
					class="text-left"
					on:click={handleFilterFromSuggestion({ suggestion })}
					id={suggestion[2]}>{suggestion[0]}</button
				>
			</div>
		{/each}
	</div>
{/if}
