<script lang="ts">
	import { updateFilteredEventsAndUdateDataForGraph, updateLineDataFromTimeline } from '$databaseMusiconn/stores/storeGraph';
	import {
		endYear,
		eventsLoadProgress,
		fetchedEvents,
		mergeEvents,
		startYear,
		timeline,
		useBounderiesYears
	} from '$databaseMusiconn/stores/storeEvents';
	import { deUrlifyerFilters, filters } from '$databaseMusiconn/stores/storeFilters';
	import { get } from 'svelte/store';

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

	useBounderiesYears.set(true); // Disable the use of boundary years

	timeline.set(data.props.timeline);
	if (!get(useBounderiesYears)) {
		startYear.set(data.props.startYear ?? data.props.firstYear);
		endYear.set(data.props.endYear ?? data.props.lastYear);
	} else {
		startYear.set(1850); // Default start year
		endYear.set(1900); // Default end year
	}
	updateLineDataFromTimeline();
	fetchedEvents.set(undefined);
	eventsLoadProgress.set(0);

	const totalPages = data.props.totalPages || (data.props.eventPages?.length ?? 0) || 1;
	let resolved = 0;

	// Stream event pages in, then apply the URL filters once everything is loaded.
	if (data.props.eventPages && data.props.eventPages.length > 0) {
		for (const entry of data.props.eventPages) {
			Promise.resolve(entry)
				.then((page: EventItem[]) => {
					mergeEvents(page);
					updateFilteredEventsAndUdateDataForGraph();
					updateLineDataFromTimeline();
					resolved++;
					eventsLoadProgress.set(resolved / totalPages);
				})
				.catch((error) => console.error('Error loading an event page:', error));
		}

		Promise.all(data.props.eventPages)
			.then(() => {
				deUrlifyerFilters(data.props.filters)
					.then(() => {
						updateFilteredEventsAndUdateDataForGraph();
						eventsLoadProgress.set(1);
					})
					.catch((error) => {
						console.error('Error in deUrlifyerFilters:', error);
						eventsLoadProgress.set(1);
					});
			})
			.catch((error) => {
				eventsLoadProgress.set(1);
				console.error('Error loading streamed events:', error);
			});
	} else {
		eventsLoadProgress.set(1);
	}
</script>