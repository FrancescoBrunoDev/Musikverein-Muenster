<script lang="ts">
	import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
	import { fetchedEvents, allTitles } from '$stores/storeEvents';
	import { deUrlifyerFilters } from '$stores/storeFilters';
	import Maintimeline from './Maintimeline.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: console.log(data.props.filtersUrl);

	fetchedEvents.set(data.props.events);

	deUrlifyerFilters(data.props.filtersUrl)
		.then(() => {
			updateFilteredEventsAndUdateDataForGraph();
		})
		.catch((error) => {
			console.error('Error in deUrlifyerFilters:', error);
		});
</script>

<Maintimeline />
<ListeEvents />
