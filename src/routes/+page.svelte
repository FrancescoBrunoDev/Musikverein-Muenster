<script>
  import LineGraph from "./LineGraph.svelte";
  import SearchSection from "./SearchSection.svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let opacitySearchSection = 100;
  let blurSearchSection = "none";
  let scaleSearchSection = 100;
  let scaleGraphSection = 100;

  function handleMouseOver() {
    opacitySearchSection = 20;
    blurSearchSection = "sm";
    scaleSearchSection = 85;
    scaleGraphSection = 105;
    console.log("mouse over");
  }

  function handleMouseOut() {
    opacitySearchSection = 100;
    blurSearchSection = "none";
    scaleSearchSection = 100;
    scaleGraphSection = 100;
    console.log("mouse out");
  }
</script>

<div class="h-screen w-screen relative">
  <div
    class="h-2/3 grid place-items-center content-center opacity-{opacitySearchSection} blur-{blurSearchSection} scale-{scaleSearchSection} z-10 transition-all duration-500"
  >
    <SearchSection />
  </div>

  <div
    role="presentation"
    class="absolute bottom-28 scale-{scaleGraphSection} transition-all duration-500"
    on:mouseover={handleMouseOver}
    on:mouseout={handleMouseOut}
    on:focus={handleMouseOver}
    on:blur={handleMouseOut}
  >
    <LineGraph />
  </div>
</div>
