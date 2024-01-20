<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import EventPerformances from './EventPerformances.svelte';
	import { getTitles, getTitleString } from '$stores/storeEvents';
	import { filters, filteredEvents } from '$stores/storeFilters';
	import { Circle, FileInput } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
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
			let dateStr = event?.dates[0].date;
			if (dateStr && dateStr !== '00.00') {
				// handle date format 00.00 or day undefined
				if (dateStr.endsWith('-00')) {
					let dateObj = new Date(dateStr.slice(0, -2) + '01');
					date = dateObj.toLocaleDateString('it-IT', { month: '2-digit' }) + '.?';
				} else {
					let dateObj = new Date(dateStr);
					date = dateObj.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
					date = date.split('/').join('.');
				}
			} else {
				date = '?';
			}
		}
		filtersArrayWithCounter = {};
		countFilters();
	}

	function handleClickEvent() {
		isEventOpen = !isEventOpen;
		if (isEventOpen) {
			getTitles(event);
		}
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
						color: filter.color || ''
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
	class={`relative w-fit overflow-hidden rounded-xl border-2 text-primary transition-all duration-100 ${
		isEventOpen
			? 'flex h-fit flex-shrink-0 flex-col'
			: 'flex flex-col justify-center gap-2 hover:scale-hover'
	}`}
>
	<button
		on:click={() => handleClickEvent()}
		class={`z-10 flex-shrink-0 flex-grow-0 font-bold transition-all duration-100 ease-in-out ${
			isEventOpen ? 'relative left-0 right-0 top-0 h-fit w-80 py-2' : 'h-32 w-24'
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
						{#await getTitleString(location.location, 'location')}
							<div />
						{:then title}
							<div transition:fly={{ y: 10, duration: 100, delay: 200 }}>{title}</div>
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
				<div class="flex flex-col gap-1">
					<div>
						<div class="text-base font-bold dark:font-semibold">
							{$LL.filters.entities.corporation()}
						</div>
						{#each event.corporations as corporation}
							{#if corporation.subject == 2}
								{#await getTitleString(corporation.corporation, 'corporation')}
									<div>loading</div>
								{:then title}
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
					<div class="flex w-fit items-center gap-2">
						<div class="text-base font-bold dark:font-semibold">
							{$LL.filters.entities.source()}
						</div>
						{#each event.sources as source}
							{#if source.url}
								<a
									class="hover:scale-hover"
									href={source.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<FileInput strokeWidth={2.25} />
								</a>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
			<div class="rounded-xl border-2 p-2">
				<div class="w-full text-base font-bold dark:font-semibold">
					{$LL.filters.entities.performances()}
				</div>
				{#if event.performances}
					<div class="divide flex flex-col gap-1 divide-y-2 dark:font-light">
						<EventPerformances {event} />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
