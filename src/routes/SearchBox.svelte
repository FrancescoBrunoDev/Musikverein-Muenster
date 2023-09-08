<script lang="ts">
  import { autocomplete } from "./dataMusiconn";
  import { addFilterElement } from "../store";

  let suggestions: AutocompleteResult[] = [];
  let inputValue = "";

  const handleInput = (query: string) => {
    const value = query;
    if (value.length > 0) {
      autocomplete(value).then((response) => {
        suggestions = response;
      });
    } else {
      suggestions = [];
    }
  };

  const handleFilterFromSuggestion = (suggestion) => {
    addFilterElement(suggestion);
    suggestions = [];
    inputValue = ""; // Clear the input field
  };
</script>

<div class="">
  <div>
    <input
      class="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
      type="text"
      id="myInput"
      bind:value={inputValue}
      on:input={(input) => handleInput(input.target.value)}
      placeholder="Search"
    />
    {#if suggestions && suggestions.length > 0}
      <div
        class="w-full max-h-64 overflow-auto grid grid-cols-1 gap-y-2 mt-2 z-10 rounded-lg p-2 border overscroll-auto bg-white"
      >
        {#each suggestions as suggestion}
          <button
            class="text-left"
            on:click={handleFilterFromSuggestion({ suggestion })}
            id={suggestion[2]}>{suggestion[0]}</button
          >
        {/each}
      </div>
    {/if}
  </div>
</div>
