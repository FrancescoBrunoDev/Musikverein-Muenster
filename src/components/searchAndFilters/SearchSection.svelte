<script lang="ts">
	import ActiveFilters from '$components/searchAndFilters/ActiveFilters.svelte';
	import SearchBox from '$components/searchAndFilters/SearchBox.svelte';
</script>

<div class="w-5/6 md:w-2/3 lg:w-1/2">
	<SearchBox />
	<ActiveFilters />
</div>
