<script lang="ts">
	import { onMount } from 'svelte';
	import { filteredEvents } from '$stores/storeFilters';
	import Event from '$components/listEvents/Event.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import {
		isSearchSectionInEventsList,
		heightSearchSection,
		isSearchSectionInEventsListOpen
	} from '$stores/storeSearchSection';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ChevronUp } from 'lucide-svelte';

	let container: HTMLElement;
	let marginButtonListEvents: string = '50px';
	const y = $isSearchSectionInEventsList ? 0 : -0;

	function toggleSearchSection() {
		$isSearchSectionInEventsListOpen = !$isSearchSectionInEventsListOpen;
		if ((marginButtonListEvents = '50px')) {
			marginButtonListEvents = `${$heightSearchSection + 50}px`;
		} else {
			marginButtonListEvents = '50px';
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (Object.keys($filteredEvents).length > 0) {
					$isSearchSectionInEventsList = entry.intersectionRatio >= 1 / 3;
				} else {
					$isSearchSectionInEventsList = false;
				}
			},
			{
				threshold: [0, 1 / 3, 2 / 3, 1]
			}
		);

		observer.observe(container);
	});
	$: console.log($isSearchSectionInEventsList);
</script>

<div
	style={$isSearchSectionInEventsList ? `margin-bottom: ${marginButtonListEvents}` : ''}
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

{#if Object.keys($filteredEvents).length > 0 && $isSearchSectionInEventsList}
	<div class="fixed bottom-0 flex h-fit w-screen justify-center">
		<div
			transition:fly={{ y: y, duration: 500, easing: cubicOut }}
			class="fixed bottom-0 flex h-fit w-fit flex-col justify-center rounded-tl-xl rounded-tr-xl bg-secondary/90 p-5 pt-1 backdrop-blur-sm dark:bg-background/90"
		>
			<button on:click={toggleSearchSection} class="flex h-fit w-full items-center justify-center">
				<ChevronUp
					class={$isSearchSectionInEventsListOpen ? 'rotate-180' : ''}
					size={30}
					stroke-width={40}
				/>
			</button>

			<div class="flex w-[42rem] justify-center">
				<SearchSection />
			</div>
		</div>
	</div>
{/if}
