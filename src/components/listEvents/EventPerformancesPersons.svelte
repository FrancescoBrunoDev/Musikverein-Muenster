<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { getTitleString } from '$stores/storeEvents';

	let { performance }: { performance: EventPerformance } = $props();

	let isPersonOpen = $state(false);

	// make a function that join all the persons in a string with |
	async function joinPersons(persons: Person[]) {
		const titles = await Promise.all(
			persons.map((person) => getTitleString(person.person, 'person'))
		);
		return titles.join(' | ');
	}
</script>

<button
	onclick={() => (isPersonOpen = !isPersonOpen)}
	class="pl-1 font-bold hover:scale-hover dark:font-semibold">{$LL.events.performedBy()}</button
>
{#if isPersonOpen}
	{#await joinPersons(performance.persons)}
		<div>load</div>
	{:then title}
		<span>:</span>
		<span class="text-sm">{title}</span>
	{/await}
{/if}
