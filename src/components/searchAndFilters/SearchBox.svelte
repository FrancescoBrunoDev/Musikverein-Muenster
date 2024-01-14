<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { autocomplete } from '$lib/dataMusiconn';
	import { Info } from 'lucide-svelte';
	import MethodSearch from '$components/searchAndFilters/MethodSearch.svelte';
	import SuggestionSearch from '$components/searchAndFilters/SuggestionSearch.svelte';
	import { entitiesForSearchBox, updateEntitiesForSearchBox } from '$stores/storeFilters';
	import { suggestions, inputValue } from '$stores/storeSearchSection';

	const entities: Entity[] = ['person', 'work', 'corporation', 'location'];

	const handleInput = () => {
		const value = $inputValue;
		if (value.length > 0) {
			autocomplete(value)
		} else {
			$suggestions = [];
		}
	};
</script>

<div class="flex w-full items-center gap-2">
	<div
		class="flex w-full items-center rounded-full bg-secondary drop-shadow-lg focus:outline-none focus:ring focus:ring-secondary px-4"
	>
		<MethodSearch />
		<input
			class="focus-none h-10 w-full cursor-text bg-transparent px-3 placeholder-text/40 outline-none"
			type="text"
			id="myInput"
			bind:value={$inputValue}
			on:input={handleInput}
			placeholder={$LL.filters.search()}
			autocomplete="off"
		/>
	</div>
	<Info size={25} stroke-width={40} />
</div>
<div class="my-2 flex gap-2 pl-2 flex-wrap">
	{#each entities as entity}
		<button
			on:click={() => {
				updateEntitiesForSearchBox(entity);
				if ($inputValue.length > 0) {
					autocomplete($inputValue);
				} else {
					$suggestions = [];
				}
			}}
			class={'hover:scale-hover rounded-full px-4 pb-[0.15rem] text-sm transition-shadow hover:drop-shadow-lg ' +
				($entitiesForSearchBox.includes(entity)
					? 'bg-secondary text-text'
					: 'bg-transparent text-text')}
		>
			{$LL.filters.entities[entity]()}
		</button>
	{/each}
</div>
<SuggestionSearch />
