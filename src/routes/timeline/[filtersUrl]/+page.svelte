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

	if (data.props.allTitles) {
		allTitles.set(data.props.allTitles);
	}

	deUrlifyerFilters(data.props.filtersUrl);
	updateFilteredEventsAndUdateDataForGraph();
</script>

<Maintimeline />
<ListeEvents />
