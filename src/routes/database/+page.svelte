<script lang="ts">
	import { updateFilteredEventsAndUdateDataForGraph } from '$databaseMusiconn/stores/storeGraph';
	import {
		fetchedEvents,
		endYear,
		startYear,
		useBounderiesYears
	} from '$databaseMusiconn/stores/storeEvents';
	import { filters } from '$databaseMusiconn/stores/storeFilters';
	import { get } from 'svelte/store';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	// clean filter from precedent
	filters.set({
		and: [],
		or: [],
		not: []
	});

	useBounderiesYears.set(true); // Disable the use of boundary years

	fetchedEvents.set(data.props.events);

	if (!get(useBounderiesYears)) {
		startYear.set(data.props.startYear);
		endYear.set(data.props.endYear);
	} else {
		startYear.set(1850); // Default start year
		endYear.set(1900); // Default end year
	}

	updateFilteredEventsAndUdateDataForGraph();
</script>
