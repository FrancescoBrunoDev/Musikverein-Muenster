<script lang="ts">
	import Maintimeline from './Maintimeline.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';
	import InfoSearch from '$components/searchAndFilters/InfoSearch.svelte';
	import { showInfoSearch } from '$stores/storeSearchSection';
</script>

<section>
	<Maintimeline />
	<ListeEvents />
	<slot />
</section>
{#if $showInfoSearch}
	<InfoSearch />
{/if}