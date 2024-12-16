<script lang="ts">
	import { onMount } from 'svelte';
	import { filteredEvents, showEventAsModal } from '$stores/storeFilters';
	import Event from '$components/listEvents/Event.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import {
		isSearchSectionInEventsList,
		isSearchSectionInEventsListOpen
	} from '$stores/storeSearchSection';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ChevronUp } from 'lucide-svelte';
	import EventWithModal from '$components/listEvents/EventWithModal.svelte';

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

<div class="flex flex-col" bind:this={container}>
	{#each Object.keys($filteredEvents) as year}
		<div class="flex flex-col">
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
					{#if $showEventAsModal}
						<EventWithModal {event} />
					{:else}
						<Event {event} />
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</div>

{#if Object.keys($filteredEvents).length > 0 && $isSearchSectionInEventsList}
	<div class="sticky bottom-0 flex h-fit justify-center md:bottom-3">
		<div
			transition:slide={{ duration: 500, easing: cubicOut }}
			class="flex h-fit w-full flex-col justify-center rounded-b-none rounded-t-xl border-x-2 border-t-2 bg-background px-8 pb-4 pt-1 shadow-2xl md:w-fit md:rounded-xl md:border-2 md:pb-2"
		>
			<button on:click={toggleSearchSection} class="flex h-fit w-full items-center justify-center">
				<ChevronUp
					class={$isSearchSectionInEventsListOpen ? 'rotate-180' : ''}
					size={30}
					stroke-width={40}
				/>
			</button>

			<div id="searchSectionBottom" class="md:w-[40rem]">
				<SearchSection />
			</div>
		</div>
	</div>
{/if}
