<script lang="ts">
  import {
    filters,
    removeFilterElement,
    changeFilterPersonOrComposer,
  } from "../store";
  import { slide } from "svelte/transition";

  // Create a function to group filters by their 'entity' property
  function groupFiltersByEntity(filters) {
    const groupedFilters = {};

    filters.forEach((filter) => {
      if (!groupedFilters[filter.entity]) {
        groupedFilters[filter.entity] = [];
      }

      groupedFilters[filter.entity].push(filter);
    });

    return groupedFilters;
  }

  // Get the grouped filters
  $: groupedFilters = groupFiltersByEntity($filters);
</script>

<div>
  {#each Object.keys(groupedFilters) as entity}
    <div class="mt-4 grid pl-2" transition:slide={{ axis: "y", delay: 150 }}>
      <h2 class="text-white text-sm font-bold mb-2">
        {entity === "person" ? "perfomer" : entity}
      </h2>
      <div class="flex gap-2 flex-wrap">
        {#each groupedFilters[entity] as filter}
          <div
            id={filter.id}
            class={"rounded-full pl-1 py-1 text-sm border text-white flex items-center gap-1" +
              (filter.entity === "person" || filter.entity === "composer"
                ? " pr-1"
                : " pr-3")}
          >
            <div
              style={`background-color: ${filter.color}`}
              class="h-5 w-5 px-2 rounded-full"
            />
            <button
              class="truncate max-w-xs"
              on:click={() => removeFilterElement(filter.id)}
            >
              {filter.name}
            </button>
            {#if filter.entity === "person" || filter.entity === "composer"}
              <button
                on:click={() =>
                  changeFilterPersonOrComposer(filter.id, filter.entity)}
                class="bg-white px-2 rounded-full text-black"
                >as a {#if filter.entity === "person"}performer{:else if filter.entity === "composer"}composer{/if}</button
              >
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
