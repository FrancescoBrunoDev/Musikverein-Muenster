<script lang="ts">
	import { onMount } from 'svelte';
	import { filteredEvents } from '$stores/storeFilters';
	import Event from '$components/listEvents/Event.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import {
		isSearchSectionInEventsList,
		isSearchSectionInEventsListOpen
	} from '$stores/storeSearchSection';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ChevronUp } from 'lucide-svelte';

	let container: HTMLElement;

	function toggleSearchSection() {
		$isSearchSectionInEventsListOpen = !$isSearchSectionInEventsListOpen;
	}

	onMount(() => {
		const searchSection = document.getElementById('searchSectionInTimeline');

		if (searchSection) {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						isSearchSectionInEventsList.set(false);
					} else {
						if (Object.keys($filteredEvents).length > 4) {
							isSearchSectionInEventsList.set(true);
						} else {
							isSearchSectionInEventsList.set(false);
						}
					}
				},
				{
					threshold: 0.1
				}
			);

			observer.observe(searchSection);
		}
	});
</script>

<div class="container w-screen max-w-6xl overflow-x-hidden" bind:this={container}>
	<div class="flex flex-col overflow-x-hidden">
		{#each Object.keys($filteredEvents) as year}
			<div class="flex flex-col overflow-x-hidden">
				<div class="flex flex-row gap-2 align-middle">
					<div class="text-7xl">{year}</div>
					<div>{$filteredEvents[year].length}</div>
				</div>
				<div class="flex flex-wrap items-start gap-2 pb-4 leading-tight">
					{#each $filteredEvents[year].slice().sort((a, b) => {
						const dateA = new Date(a.dates[0].date);
						const dateB = new Date(b.dates[0].date);
						return dateA.getTime() - dateB.getTime();
					}) as event}
						<Event eventUid={event.uid} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

{#if Object.keys($filteredEvents).length > 0 && $isSearchSectionInEventsList}
	<div class="sticky bottom-0 z-40 flex h-fit w-screen justify-center">
		<div
			transition:slide={{ duration: 500, easing: cubicOut }}
			class="flex h-fit w-fit flex-col justify-center rounded-tl-xl rounded-tr-xl bg-background p-5 pt-1 shadow-2xl"
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
