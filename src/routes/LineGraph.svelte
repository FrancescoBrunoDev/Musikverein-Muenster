<script lang="ts">
  import { Scatter } from "@unovis/ts";
  import {
    VisXYContainer,
    VisLine,
    VisAxis,
    VisScatter,
    VisTooltip,
  } from "@unovis/svelte";
  import { onMount } from "svelte";
  import {
    fetchAndStoreEvents,
    filters,
    fetchedEvents,
    filteredEvents,
    filteredEventsForGraph,
    updateFilteredEventsAndUdateDataForGraph,
  } from "../store";

  onMount(async () => {
    await fetchAndStoreEvents().then(() => {
      updateFilteredEventsAndUdateDataForGraph();
    });
  });

  let data: DataRecordChart[] = []; // Declare data as a variable outside of onMount
  function getY(c: Filter): (d: DataRecord) => string {
    return (d: DataRecord) => d.filters[c.name];
  }
  const x = (d: DataRecordCoordinates) => d.x;
  let y;

  const triggers = {
    [Scatter.selectors.point]: (d: DataRecordCoordinates) =>
      `<span>x :  ${d.x}<br / >y :  ${d.y}</span>`,
  };

  $: {
    async function updateGraph() {
      let _dataForGraph = {};
      if ($filters.length === 0) {
        _dataForGraph = $fetchedEvents;

        y = (d: DataRecordCoordinates) => d.eventCount;
      } else {
        _dataForGraph = $filteredEvents;
        y = $filters.map(getY);
      }
      data = $filteredEventsForGraph;
    }
    updateGraph();
  }
</script>

<div class="relative">
  <div
    class="bg-gradient-to-r absolute from-black w-32 h-full to-transparent z-50"
  />
  <div
    class="bg-gradient-to-l right-0 absolute from-black to-transparent w-32 h-full z-50"
  />
  {#if data && data.length > 0}
    <div class="z-10 w-screen">
      <VisXYContainer
        {data}
        height={300}
        scaleByDomain={true}
        xDomain={[1850, 1910]}
        yDomain={[0, 30]}
      >
        <VisLine {x} {y} />
        <VisScatter {x} {y} size={7} />
        <VisTooltip {triggers} />
        <VisAxis
          gridLine={false}
          domainLine={false}
          tickLine={undefined}
          type="x"
        />
      </VisXYContainer>
    </div>
  {/if}
</div>
