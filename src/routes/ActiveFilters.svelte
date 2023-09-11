<script lang="ts">
  import { filters, removeFilterElement } from "../store";
  import { slide, fade } from "svelte/transition";

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
    <div class="mt-4 grid border-l-2 pl-2 border-slate-500" transition:slide={{ axis: "y", delay: 150 }}>
      <h2 class="text-white text-sm font-semibold mb-2">{entity}</h2>
      <div class="flex gap-2 flex-wrap">
        {#each groupedFilters[entity] as filter}
          <div
            id={filter.id}
            class="inline-block rounded-full px-3 py-1 text-sm bg-slate-100 max-w-sm truncate"
          >
            <button on:click={() => removeFilterElement(filter.id)}>
              {filter.name}
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
