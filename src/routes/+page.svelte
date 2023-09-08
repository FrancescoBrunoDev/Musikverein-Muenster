<script>
  import LineGraph from "./LineGraph.svelte";
  import SearchSection from "./SearchSection.svelte";
</script>

<div class="h-screen lg:w-1/2 md:w-2/3 w-5/6">
  <div class="h-1/2 grid content-center">
    <SearchSection />
  </div>
  <div class="h-1/2">
    <LineGraph />
  </div>
</div>
