<script lang="ts">
	import {
		updateFilteredEventsAndUdateDataForGraph,
		updateLineDataFromTimeline
	} from '$databaseMusiconn/stores/storeGraph';
	import {
		fetchedEvents,
		endYear,
		startYear,
		timeline,
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

	// Ship the cheap per-year histogram first so the line graph renders instantly
	// while the detailed event list streams in.
	timeline.set(data.props.timeline);
	if (!get(useBounderiesYears)) {
		startYear.set(data.props.startYear);
		endYear.set(data.props.endYear);
	} else {
		startYear.set(1850); // Default start year
		endYear.set(1900); // Default end year
	}
	updateLineDataFromTimeline();

	// Stream the detailed events: `data.props.events` is either a cached object
	// (resolves immediately) or a streaming Promise. Populate the stores once it
	// resolves and rebuild the graph/list from the full data.
	(async () => {
		try {
			const events = (await data.props.events) as Events;
			if (events) {
				fetchedEvents.set(events);
				updateFilteredEventsAndUdateDataForGraph();
			}
		} catch (error) {
			console.error('Error loading streamed events:', error);
		}
	})();
</script>