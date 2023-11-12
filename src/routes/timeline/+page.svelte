<script lang="ts">
	import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
	import { fetchedEvents, allTitles } from '$stores/storeEvents';
	import Maintimeline from '$components/Maintimeline.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	fetchedEvents.set(data.props.events);
	if (data.props.allTitles) {
		allTitles.set(data.props.allTitles);
	}
	updateFilteredEventsAndUdateDataForGraph();
</script>

<Maintimeline />
<ListeEvents />
