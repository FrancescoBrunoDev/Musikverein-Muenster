<script lang="ts">
	import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
	import { fetchedEvents } from '$stores/storeEvents';
	import { filters } from '$stores/storeFilters';

	const { data } = $props();
	// clean filter from precedent
	filters.set({
		and: [],
		or: [],
		not: []
	});

	fetchedEvents.set(data.props.events);

	updateFilteredEventsAndUdateDataForGraph();
</script>
