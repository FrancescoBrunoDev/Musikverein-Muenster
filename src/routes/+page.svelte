<script>
	import LineGraph from './LineGraph.svelte';
	import SearchSection from './SearchSection.svelte';
</script>

<div class="h-screen">
	<div class="h-1/2 grid content-center">
		<SearchSection />
	</div>
	<div class="h-1/2">
		<LineGraph />
	</div>
</div>
