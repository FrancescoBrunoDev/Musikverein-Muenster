<script lang="ts">
	import { autocomplete } from '$lib/dataMusiconn';
	import { Info } from 'lucide-svelte';
	import MethodSearch from '$components/MethodSearch.svelte';
	import SuggestionSearch from './SuggestionSearch.svelte';
	import { entitiesForSearchBox, updateEntitiesForSearchBox } from '$stores/storeFilters';

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

	const Entities = ['person', 'work', 'corporation'];
</script>

<div class="flex w-full items-center gap-2">
	<div
		class="flex w-full items-center rounded-full bg-primary drop-shadow-lg focus:outline-none focus:ring focus:ring-secondary"
	>
		<MethodSearch />
		<input
			class="focus-none h-10 w-full cursor-text bg-transparent px-3 text-secondary placeholder-background outline-none"
			type="text"
			id="myInput"
			bind:value={inputValue}
			on:input={(input) => handleInput(input.target.value)}
			placeholder="Search"
		/>
	</div>
	<Info size={25} stroke-width={40} />
</div>
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
<SuggestionSearch {suggestions} {inputValue} />
