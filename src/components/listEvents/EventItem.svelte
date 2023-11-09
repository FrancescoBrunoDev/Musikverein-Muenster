<script lang="ts">
	import EventPerformances from './EventPerformances.svelte';
	import { getTitle } from '$stores/storeEvents';
	import { filters, filteredEvents } from '$stores/storeFilters';
	import { Circle } from 'lucide-svelte';
	export let eventUid: number;

	let event: EventItem;
	let date: string;
	let isEventOpen = false;
	let filtersArrayWithCounter: {
		[key: string]: {
			counter: number;
			color: string;
		};
	} = {};

	$: {
		if ($filteredEvents) {
			Object.keys($filteredEvents).forEach((year) => {
				$filteredEvents[year as keyof Events].forEach((eventItem: EventItem) => {
					if (eventItem.uid === eventUid) {
						event = eventItem;
					}
				});
			});
			date = event?.dates[0].date.slice(5).replaceAll('-', '.') || '';
			if (date.slice(0, 5) === '00.00') {
				date = date.replaceAll('00.00', '?');
			}
		}
		// clean the filtersArrayWithCounter
		filtersArrayWithCounter = {};
		countFilters();
	}

	function handleClickEvent() {
		isEventOpen = !isEventOpen;
	}

	function countFilters() {
		const incrementCounter = (id: number, condition: boolean) => {
			if (condition) {
				filtersArrayWithCounter[id].counter++;
			}
		};

		$filters.or.forEach((filter) => {
			if (!filtersArrayWithCounter.hasOwnProperty(filter.id)) {
				filtersArrayWithCounter[filter.id] = {
					counter: 0,
					color: filter.color
				};
			}

			if (!event.performances) return;

			switch (filter.entity) {
				case 'composer':
					event.performances.forEach((performance) => {
						incrementCounter(
							filter.id,
							performance.composers && filter.id == performance.composers[0].person
						);
					});
					break;
				case 'work':
					event.performances.forEach((performance) => {
						incrementCounter(filter.id, performance && filter.id == performance.work);
					});
					break;
				case 'corporation':
					if (event.corporations) {
						event.corporations.forEach((corporation) => {
							incrementCounter(filter.id, filter.id == corporation.corporation);
						});
					}
					break;
				case 'person':
					event.performances.forEach((performance) => {
						if (performance.persons) {
							performance.persons.forEach((person) => {
								incrementCounter(filter.id, filter.id == person.person);
							});
						}
					});
					break;
			}
		});

		filtersArrayWithCounter;
	}
</script>

<div
	class={`w-fit ${
		isEventOpen
			? 'flex h-fit flex-shrink-0 flex-col border-2 border-primary dark:border-secondary'
			: 'flex flex-col justify-center gap-2'
	}`}
>
	<button
		on:click={() => handleClickEvent()}
		class={`flex-shrink-0 flex-grow-0 border-primary font-bold dark:border-secondary ${
			isEventOpen
				? 'relative left-0 right-0 top-0 h-fit w-80 border-b-2 py-2'
				: 'h-32 w-24 border-2'
		}`}
		>{date}
		{#if !isEventOpen}
			<div class="flex flex-wrap justify-center gap-2">
				{#each Object.keys(filtersArrayWithCounter) as key}
					{#if filtersArrayWithCounter[key].counter > 0}
						<span class="flex items-center gap-1 text-sm font-light">
							{filtersArrayWithCounter[key].counter}
							<Circle
								class="flex-shrink-0"
								fill={filtersArrayWithCounter[key].color}
								size={10}
								stroke-opacity={0}
							/>
						</span>
					{/if}
				{/each}
			</div>
		{/if}
		{#if !isEventOpen}
			<div class="flex flex-wrap justify-center gap-1"></div>
		{/if}
		{#if isEventOpen}
			<br />
			<span class="text-sm dark:font-semibold">
				{#if event.locations}
					{#each event.locations as location}
						{#await getTitle(location.location, 'location') then title}
							{title}
						{:catch error}
							<div>Error: {error.message}</div>
						{/await}
					{/each}
				{/if}
			</span>
		{/if}
	</button>
	{#if isEventOpen}
		<div class="flex w-80 flex-col gap-4 p-2">
			{#if event.corporations}
				<div>
					<div class="text-base font-bold dark:font-semibold">Corporations</div>
					{#each event.corporations as corporation}
						{#if corporation.subject == 2}
							{#await getTitle(corporation.corporation, 'corporation') then title}
								<div class="flex items-center gap-1">
									{#each $filters.or as filter}
										{#if filter.entity === 'corporation' && filter.id == corporation.corporation}
											<Circle
												class="flex-shrink-0"
												fill={filter.color}
												size={10}
												stroke-opacity={0}
											/>
										{/if}
									{/each}
									<span class="text-sm">{title}</span>
								</div>
							{:catch error}
								<div>Error: {error.message}</div>
							{/await}
						{/if}
					{/each}
				</div>
			{/if}
			<div>
				<div class="w-full text-base font-bold dark:font-semibold">Performances</div>
				{#if event.performances}
					<div class="flex flex-col gap-1 divide-y-2 divide-primary dark:divide-secondary">
						<EventPerformances {event} />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
