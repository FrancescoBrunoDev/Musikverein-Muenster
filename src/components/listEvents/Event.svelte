<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import EventPerformances from './EventPerformances.svelte';
	import { allTitles, getTitle } from '$stores/storeEvents';
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

		Object.values($filters).forEach((method) => {
			method.forEach((filter) => {
				if (!filtersArrayWithCounter.hasOwnProperty(filter.id)) {
					filtersArrayWithCounter[filter.id] = {
						counter: 0,
						color: filter.color
					};
				}

				if (!event.performances) return;

				switch (filter.entity) {
					case 'composer':
					case 'work':
					case 'person':
						event.performances.forEach((performance) => {
							if (filter.entity === 'composer' && performance.composers) {
								incrementCounter(
									filter.id,
									performance.composers && filter.id == performance.composers[0].person
								);
							} else if (filter.entity === 'work') {
								incrementCounter(filter.id, performance && filter.id == performance.work);
							} else if (filter.entity === 'person' && performance.persons) {
								performance.persons.forEach((person) => {
									incrementCounter(filter.id, filter.id == person.person);
								});
							}
						});
						break;
					case 'corporation':
						if (event.corporations) {
							event.corporations.forEach((corporation) => {
								incrementCounter(filter.id, filter.id == corporation.corporation);
							});
						}
						break;
				}
			});
		});

		filtersArrayWithCounter;
	}
</script>

<div
	class={`relative w-fit overflow-hidden rounded-xl border-2 border-secondary bg-secondary ${
		isEventOpen
			? 'flex h-fit flex-shrink-0 flex-col'
			: 'hover:scale-hover flex flex-col justify-center gap-2 transition-all duration-100'
	}`}
>
	<button
		on:click={() => handleClickEvent()}
		class={`z-10 flex-shrink-0 flex-grow-0 font-bold ${
			isEventOpen
				? 'relative left-0 right-0 top-0 h-fit w-80 border-b-2 border-background py-2'
				: 'h-32 w-24'
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
					<div class="text-base font-bold dark:font-semibold">
						{$LL.filters.entities.corporation()}
					</div>
					{#each event.corporations as corporation}
						{#if corporation.subject == 2}
							{#await getTitle(corporation.corporation, 'corporation') then title}
								<div class="flex items-center gap-1">
									{#each Object.values($filters).flat() as filter}
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
				<div class="w-full text-base font-bold dark:font-semibold">
					{$LL.filters.entities.performances()}
				</div>
				{#if event.performances}
					<div class="flex flex-col gap-1 divide-y-2 divide-background dark:font-light">
						<EventPerformances {event} />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
