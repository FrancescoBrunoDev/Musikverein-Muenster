<script lang="ts">
  import { Scatter } from "@unovis/ts";
  import {
    VisXYContainer,
    VisLine,
    VisAxis,
    VisScatter,
    VisTooltip,
  } from "@unovis/svelte";
  import { dataForGraph, filterEventsByYear } from "./dataMusiconn";
  import { onMount } from "svelte";
  import { fetchAndStoreEvents, filters, fetchedEvents } from "../store";

  console.log($filters, "filters in component");

  onMount(async () => {
    await fetchAndStoreEvents();
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
        _dataForGraph = await filterEventsByYear($filters);
        y = $filters.map(getY);
      }
      const res = await dataForGraph($fetchedEvents);
      data = res[0].data;
    }
    updateGraph();
  }
</script>

{#if data && data.length > 0}
  <VisXYContainer
    {data}
    height={400}
    scaleByDomain={true}
    xDomain={[1850, 1900]}
    yDomain={[0, 20]}
  >
    <VisLine {x} {y} />
    <VisScatter {x} {y} size={10} />
    <VisTooltip {triggers} />
    <VisAxis
      gridLine={false}
      domainLine={false}
      tickLine={undefined}
      type="x"
    />
  </VisXYContainer>
{/if}
