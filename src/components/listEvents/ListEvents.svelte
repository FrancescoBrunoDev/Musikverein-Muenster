<script lang="ts">
	import { onMount } from 'svelte';
	import { filteredEvents } from '$stores/storeFilters';
	import Event from '$components/listEvents/Event.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import { isSearchSectionInEventsList, heightSearchSection } from '$stores/storeSearchSection';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ChevronUp } from 'lucide-svelte';

	let container: HTMLElement;
	let isSearchSectionInEventsListOpen: boolean = false;
	let marginButtonListEvents: string = '50px';

	function toggleSearchSection() {
		isSearchSectionInEventsListOpen = !isSearchSectionInEventsListOpen;
		if ((marginButtonListEvents = '50px')) {
			marginButtonListEvents = `${$heightSearchSection + 50}px`;
		} else {
			marginButtonListEvents = '50px';
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				$isSearchSectionInEventsList = entry.intersectionRatio >= 1 / 3;
			},
			{
				threshold: [0, 1 / 3, 2 / 3, 1]
			}
		);

		observer.observe(container);
	});
</script>

<div
	style={`margin-bottom: ${marginButtonListEvents}`}
	class="container w-screen overflow-x-hidden"
	bind:this={container}
>
	<div class="flex flex-col overflow-x-hidden">
		{#each Object.keys($filteredEvents) as year}
			<div class="flex flex-col overflow-x-hidden">
				<div class="flex flex-row gap-2 align-middle">
					<div class="text-2xl">{year}</div>
					<div>{$filteredEvents[year].length}</div>
				</div>
				<div class="flex flex-row items-start gap-2 overflow-x-scroll pb-4 leading-tight">
					{#each $filteredEvents[year] as event}
						<Event eventUid={event.uid} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

{#if $isSearchSectionInEventsList}
	<div
		transition:fade={{ duration: 400, easing: cubicOut }}
		class="fixed bottom-0 flex h-fit w-screen flex-col justify-center rounded-tl-xl rounded-tr-xl bg-secondary/90 backdrop-blur-sm dark:bg-background/90"
	>
		<button on:click={toggleSearchSection} class=" flex h-10 w-screen items-center justify-center">
			<ChevronUp
				class={isSearchSectionInEventsListOpen ? 'rotate-180' : ''}
				size={30}
				stroke-width={40}
			/>
		</button>
		{#if isSearchSectionInEventsListOpen}
			<div class="flex w-screen justify-center pb-5">
				<SearchSection />
			</div>
		{/if}
	</div>
{/if}
