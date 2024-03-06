<script lang="ts">
	import { slide } from 'svelte/transition';
	import { addFilterElement, entitiesForSearchBox } from '$stores/storeFilters';
	import { suggestions, inputValue } from '$stores/storeSearchSection';
	import { onMount } from 'svelte';
	import { urlBaseAPIMusiconn } from '$stores/storeGeneral';
	import { projectID } from '$stores/storeEvents';
	import { Loader2 } from 'lucide-svelte';
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

	async function getNumbers(suggestionID: number, entity: Entity) {
		const res = await fetch(
			`${urlBaseAPIMusiconn}?action=query&${entity}=${suggestionID}&entity=none&format=json&project=${$projectID}`
		);
		if (res.ok) {
			const { count } = await res.json();
			return count.event;
		} else {
			console.error('Fetch failed', res.status, res.statusText);
		}
	}
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
					<div class="flex h-5 items-center rounded-full border-2 border-text px-2 text-xs">
						{suggestion[1]}
					</div>
				{/if}

				<button
					class="text-left"
					on:click={() => handleFilterFromSuggestion({ suggestion })}
					id={suggestion[2]}>{suggestion[0]}</button
				>
				{#await getNumbers(Number(suggestion[2]), suggestion[1])}
					<span class="flex h-5 items-center rounded-full bg-primary px-2 text-xs text-secondary">
						<Loader2 class="h-full animate-spin" />
					</span>
				{:then numberEvents}
					{#if Number(numberEvents) > 0}
						<span class="flex h-5 items-center rounded-full bg-primary px-2 text-xs text-secondary">
							{numberEvents}
						</span>
					{/if}
				{:catch error}
					<div>not availe now</div>
				{/await}
			</div>
		{/each}
	</div>
{/if}
