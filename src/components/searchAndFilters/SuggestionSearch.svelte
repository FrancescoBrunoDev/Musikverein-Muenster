<script lang="ts">
	import { slide } from 'svelte/transition';
	import { addFilterElement, entitiesForSearchBox } from '$stores/storeFilters';
	import { suggestions, inputValue } from '$stores/storeSearchSection';
	import { onMount } from 'svelte';
	import { urlBaseAPIMusiconn } from '$stores/storeGeneral';
	import { projectID } from '$stores/storeEvents';
	import { Loader2 } from 'lucide-svelte';
	import { isSearchSectionInEventsList } from '$stores/storeSearchSection';

	let div: HTMLDivElement | undefined = $state(undefined);
	let isOpen: boolean = $state(false);

	const handleFilterFromSuggestion = (suggestion: any) => {
		addFilterElement(suggestion);
		$inputValue = '';
		$suggestions = [];
		isOpen = false;
	};

	$effect(() => {
		let searchSection = $derived.by(() => {
			return $isSearchSectionInEventsList
				? (document.getElementById('searchSectionBottom') as HTMLDivElement)
				: (document.getElementById('searchSectionInTimeline') as HTMLDivElement);
		});

		let searchInput = $derived(searchSection?.querySelector('input'));

		$inspect(searchSection);

		// open the search box when the input is focused
		if (searchInput) {
			searchInput.addEventListener('focus', () => {
				isOpen = true;
			});
		}

		const handleClickOutside = (event: MouseEvent) => {
			if (searchSection && !searchSection.contains(event.target as Node)) {
				isOpen = false;
			}
		};

		window.addEventListener('click', handleClickOutside);

		return () => {
			window.removeEventListener('click', handleClickOutside);
		};
	});

	async function getNumbers(suggestionID: number, entity: string | undefined) {
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

{#if isOpen}
	<div
		bind:this={div}
		transition:slide
		class="z-10 mt-2 flex h-52 w-full flex-col gap-y-2 overflow-auto overscroll-auto rounded-xl border-2 bg-background p-2"
	>
		{#if $suggestions && $suggestions.length > 0}
			{#each $suggestions as suggestion}
				<div class="flex h-fit items-center gap-1">
					{#if $entitiesForSearchBox.length > 1}
						<div class="flex h-5 items-center rounded-full border-2 border-text px-2 text-xs">
							{suggestion[1]}
						</div>
					{/if}

					<button
						class="text-left w-full"
						onclick={() => handleFilterFromSuggestion({ suggestion })}
						id={suggestion[2]}>{suggestion[0]}</button
					>
					{#await getNumbers(Number(suggestion[2]), suggestion[1])}
						<span class="flex h-5 items-center rounded-full bg-primary px-2 text-xs text-secondary">
							<Loader2 class="h-full animate-spin py-1" />
						</span>
					{:then numberEvents}
						{#if Number(numberEvents) > 0}
							<span
								class="flex h-5 items-center rounded-full bg-primary px-2 text-xs text-secondary"
							>
								{numberEvents}
							</span>
						{/if}
					{:catch error}
						<div>not availe now</div>
					{/await}
				</div>
			{/each}
		{:else}
			<div class="flex h-full items-center justify-center text-border">
				<p>No suggestions</p>
			</div>
		{/if}
	</div>
{/if}
