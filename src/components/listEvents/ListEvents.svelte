<script>
	import { filteredEvents } from '$stores/storeFilters';
	import EventItem from '$components/listEvents/EventItem.svelte';
	$: console.log($filteredEvents, 'filteredEvents');
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
					{#if $filteredEvents.length === 0}
						<div class="text-sm">Caricamento</div>
					{:else}
						{#each $filteredEvents[year] as event}
							<EventItem eventUid={event.uid} />
						{/each}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
