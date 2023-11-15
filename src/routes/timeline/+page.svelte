<script lang="ts">
	import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
	import { fetchedEvents } from '$stores/storeEvents';
	import { filters } from '$stores/storeFilters';
	import type { PageData } from './$types';

	export let data: PageData;
	// clean filter from precedent
	filters.set({
		and: [],
		or: [],
		not: []
	});
	
	fetchedEvents.set(data.props.events);

	updateFilteredEventsAndUdateDataForGraph();
</script>
