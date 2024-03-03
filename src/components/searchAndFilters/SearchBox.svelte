<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { autocomplete } from '$lib/dataMusiconn';
	import MethodSearch from '$components/searchAndFilters/MethodSearch.svelte';
	import SuggestionSearch from '$components/searchAndFilters/SuggestionSearch.svelte';
	import { entitiesForSearchBox, updateEntitiesForSearchBox } from '$stores/storeFilters';
	import { suggestions, inputValue } from '$stores/storeSearchSection';
	import InfoSearch from './InfoSearch.svelte';

	const entities: Entity[] = ['person', 'work', 'corporation', 'location'];

    let timeoutId: number | undefined;

    const handleInput = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            const value = $inputValue;
            if (value.length > 0) {
                autocomplete(value);
            } else {
                $suggestions = [];
            }
        }, 300);
    };
</script>

<div class="flex w-full items-center gap-2">
	<div
		class="flex w-full items-center rounded-full bg-primary px-4 text-background drop-shadow-lg focus:outline-none focus:ring focus:ring-secondary"
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
	<InfoSearch />
</div>
<div class="my-2 flex flex-wrap gap-2 pl-2">
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
			class={'rounded-full border-2 px-4 pb-[0.15rem] text-sm transition-shadow hover:scale-hover hover:drop-shadow-lg ' +
				($entitiesForSearchBox.includes(entity)
					? 'border-primary bg-primary text-background'
					: 'bg-transparent')}
		>
			{$LL.filters.entities[entity]()}
		</button>
	{/each}
</div>
<SuggestionSearch />
