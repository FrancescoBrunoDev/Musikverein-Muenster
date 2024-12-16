<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { getTitleString } from '$stores/storeEvents';

	export let performance: EventPerformance;

	let isPersonOpen = false;

	// make a function that join all the persons in a string with |
	async function joinPersons(persons: Person[]) {
		const titles = await Promise.all(
			persons.map((person) => getTitleString(person.person, 'person'))
		);
		return titles.join(' | ');
	}
</script>

<button
	on:click={() => (isPersonOpen = !isPersonOpen)}
	class="font-bold hover:scale-hover dark:font-semibold">{$LL.events.performedBy()}</button
>
{#if isPersonOpen}
	{#await joinPersons(performance.persons)}
		<div>load</div>
	{:then title}
		<span>:</span>
		<span class="text-sm">{title}</span>
	{/await}
{/if}
