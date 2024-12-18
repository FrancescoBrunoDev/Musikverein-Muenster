<script lang="ts">
	import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
	import { fetchedEvents } from '$stores/storeEvents';
	import { deUrlifyerFilters, filters } from '$stores/storeFilters';

	import type { PageData } from './$types';

	export let data: PageData;

	filters.set({
		and: [],
		or: [],
		not: []
	});

	fetchedEvents.set(data.props.events);

	deUrlifyerFilters(data.props.filters)
		.then(() => {
			updateFilteredEventsAndUdateDataForGraph();
		})
		.catch((error) => {
			console.error('Error in deUrlifyerFilters:', error);
		});
</script>
