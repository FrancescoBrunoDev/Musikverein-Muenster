<script>
	import { onMount } from 'svelte';
	import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
	import { filteredEventsForGraph } from '$stores/storeGraph';
	import { fetchAndStoreEvents } from '$stores/storeEvents';
	import Maintimeline from '$components/Maintimeline.svelte';

	// $: console.log($filteredEventsForGraph, 'filteredEventsForGraph');

	onMount(async () => {
		await fetchAndStoreEvents().then(() => {
			updateFilteredEventsAndUdateDataForGraph();
		});
	});
</script>

<Maintimeline />
