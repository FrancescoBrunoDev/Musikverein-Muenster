<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import {
		autocomplete,
		setInputValue,
		deleteSuggestions
	} from '$states/stateSearchSection.svelte';
	import MethodSearch from '$components/searchAndFilters/MethodSearch.svelte';
	import SuggestionSearch from '$components/searchAndFilters/SuggestionSearch.svelte';
	import { entitiesForSearchBox, updateEntitiesForSearchBox } from '$stores/storeFilters';

	const entities: Entity[] = ['person', 'work', 'corporation', 'location'];

	let timeoutId: number | undefined = $state(undefined);
	let _inputValue: string = $state('');

	$effect(() => {
		setInputValue({ value: _inputValue });
	});

	const handleInput = () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			if (_inputValue.length > 0) {
				autocomplete();
			} else {
				deleteSuggestions;
			}
		}, 300);
	};
</script>

<div class="flex items-center gap-2">
	<div
		class="flex w-full items-center rounded-full bg-primary px-4 text-background drop-shadow-lg focus:outline-hidden focus:ring-3 focus:ring-secondary"
	>
		<MethodSearch />
		<input
			class="focus-none h-10 w-full cursor-text bg-transparent px-3 placeholder-text/40 outline-hidden"
			type="text"
			id="searchInput"
			bind:value={_inputValue}
			oninput={handleInput}
			placeholder={$LL.filters.search()}
			autocomplete="off"
		/>
	</div>
</div>
<div class="my-2 flex flex-wrap gap-2 pl-2">
	{#each entities as entity}
		<button
			onclick={() => {
				updateEntitiesForSearchBox(entity);
				if (_inputValue.length > 0) {
					autocomplete();
				} else {
					deleteSuggestions;
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
