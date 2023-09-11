<script>
  import LineGraph from "./LineGraph.svelte";
  import SearchSection from "./SearchSection.svelte";
</script>

<div class="h-screen w-screen relative">
  <div class="h-2/3 grid place-items-center content-center">
    <SearchSection />
  </div>

  <div class="absolute bottom-28">
    <LineGraph />
  </div>
</div>
