<script>
	import { onMount } from 'svelte';
	import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
	import { fetchAndStoreEvents } from '$stores/storeEvents';
	import Maintimeline from '$components/Maintimeline.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';
	import { getTitles } from '$stores/storeEvents';

	// $: console.log($filteredEventsForGraph, 'filteredEventsForGraph');

	onMount(async () => {
		await fetchAndStoreEvents()
			.then(() => {
				updateFilteredEventsAndUdateDataForGraph();
			})
			.then(() => {
				getTitles();
			});
	});
</script>

<Maintimeline />
<ListeEvents />
