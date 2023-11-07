<script>
	import { filteredEvents } from '$stores/storeFilters';
	import EventItem from '$components/listEvents/EventItem.svelte';
</script>

<div class="container w-screen overflow-x-hidden">
	<div class="flex flex-col overflow-x-hidden">
		{#each Object.keys($filteredEvents) as year}
			<div class="flex flex-col overflow-x-hidden">
				<div class="flex flex-row gap-2 align-middle">
					<div class="text-2xl">{year}</div>
					<div>{$filteredEvents[year].length}</div>
				</div>
				<div class="flex flex-row gap-2 overflow-x-scroll pb-4 leading-tight">
					{#each $filteredEvents[year] as event}
						<EventItem {event} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
