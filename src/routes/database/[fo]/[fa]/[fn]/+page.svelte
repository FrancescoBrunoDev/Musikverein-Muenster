<script lang="ts">
	import { updateFilteredEventsAndUdateDataForGraph } from '$databaseMusiconn/stores/storeGraph';
	import { fetchedEvents } from '$databaseMusiconn/stores/storeEvents';
	import { deUrlifyerFilters, filters } from '$databaseMusiconn/stores/storeFilters';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

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
