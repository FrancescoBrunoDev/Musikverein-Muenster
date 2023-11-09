<script lang="ts">
	import { getTitle } from '$stores/storeEvents';

	export let performance: EventPerformance;

	let isPersonOpen = false;

	// make a function that join all the persons in a string with |
	function joinPersons(persons: Person[]) {
		let personsString = '';
		persons.forEach((person, index) => {
			const personTitle = getTitle(person.person, 'person');
			if (index === 0) {
				personsString += personTitle;
			} else {
				personsString += ` | ${personTitle}`;
			}
		});
		return personsString;
	}
</script>

<button
	on:click={() => (isPersonOpen = !isPersonOpen)}
	class="font-bold hover:scale-[1.01] dark:font-semibold">performed by</button
>
{#if isPersonOpen}
	<span class="text-sm">{joinPersons(performance.persons)}</span>
{/if}
