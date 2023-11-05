<script>
	import { personTitles } from '$stores/storeEvents';

	export let performance;

	let isPersonOpen = false;

	function getTitlePerson(uid) {
		const { title } = $personTitles[uid];
		return title;
	}

	// make a function that join all the persons in a string with |
	function joinPersons(persons) {
		let personsString = '';
		persons.forEach((person, index) => {
            const personTitle = getTitlePerson(person.person);
			if (index === 0) {
				personsString += personTitle;
			} else {
				personsString += ` | ${personTitle}`;
			}
		});
		return personsString;
	}
</script>

<button on:click={() => (isPersonOpen = !isPersonOpen)} class="font-bold hover:scale-[1.01]">performed by</button>
{#if isPersonOpen}
	<span class="text-sm">{joinPersons(performance.persons)}</span>
{/if}
