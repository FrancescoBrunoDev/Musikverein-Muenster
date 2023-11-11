<script lang="ts">
	import { filteredEvents, filters } from '$stores/storeFilters';
	import EventItem from '$components/listEvents/EventItem.svelte';

	// use the filters to group the events toghether if they have have the same metchAnd uid and entity
	let filteredEventsGrouped: {
		[key: string]: {
			[key: string]: {
				[key: string]: EventItem[];
			};
		};
	} = {};

	$: {
		if ($filteredEvents && $filters.and.length > 0) {
			Object.keys($filteredEvents).forEach((year) => {
				filteredEventsGrouped[year] = $filteredEvents[year].reduce(
					(groupedEvents, eventItem) => {
						const key = eventItem.metchAnd ? 'and' : 'notAnd';
						if (!groupedEvents[key][eventItem.uid]) {
							groupedEvents[key][eventItem.uid] = [];
						}
						groupedEvents[key][eventItem.uid].push(eventItem);
						return groupedEvents;
					},
					{ and: {}, notAnd: {} }
				);
			});
		}
	}

	$: console.log(filteredEventsGrouped, 'filteredEventsGrouped');
</script>

<div class="container w-screen overflow-x-hidden">
	<div class="flex flex-col overflow-x-hidden">
		{#each Object.keys($filteredEvents) as year}
			<div class="flex flex-col overflow-x-hidden">
				<div class="flex flex-row gap-2 align-middle">
					<div class="text-2xl">{year}</div>
					<div>{$filteredEvents[year].length}</div>
				</div>
				<div class="flex flex-row items-start gap-2 overflow-x-scroll pb-4 leading-tight">
					{#each $filteredEvents[year] as event}
						<EventItem eventUid={event.uid} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
