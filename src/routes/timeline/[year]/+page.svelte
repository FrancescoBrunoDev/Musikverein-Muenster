<script lang="ts">
	import Maintimeline from '$components/Maintimeline.svelte';
	import type { PageData } from './$types';
	import { filteredEvents } from '$stores/storeFilters';
	$: console.log($filteredEvents, 'filteredEvents');

	export let data: PageData;
</script>

<h1>{data.year}</h1>
<div>{@html data.content}</div>
<Maintimeline />
