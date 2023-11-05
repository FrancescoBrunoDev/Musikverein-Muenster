<script>
	import EventPerformances from './EventPerformances.svelte';
	import { locationTitles } from '$stores/storeEvents';
	export let event;
	let isEventOpen = false;

	async function getTitleLocation(uid) {
		const { title } = $locationTitles[uid];
		return title;
	}

	function handleClickEvent() {
		isEventOpen = !isEventOpen;
	}

	let date = event.dates[0].date.slice(5).replaceAll('-', '.');
	if (date.slice(0, 5) === '00.00') {
		date = date.replaceAll('00.00', '?');
	}
</script>

{#if !isEventOpen}
	<button
		on:click={() => handleClickEvent()}
		class="h-32 w-24 flex-shrink-0 flex-grow-0 border-2 border-primary font-bold">{date}</button
	>
{/if}
{#if isEventOpen}
	<div key={event.uid} class="flex h-fit w-80 flex-shrink-0 flex-col border-2 border-primary">
		<button
			on:click={() => handleClickEvent()}
			class="relative left-0 right-0 top-0 h-fit flex-shrink-0 flex-grow-0 border-b-2 border-primary font-bold"
			>{date}
			<br />
			<span class="text-sm">
				{#if event.locations}
					{#each event.locations as location}
						{#await getTitleLocation(location.location) then title}
							{title}
						{:catch error}
							<div>Error: {error.message}</div>
						{/await}
					{/each}
				{/if}
			</span></button
		>

		<div class="p-2">
			<div class="font-bold text-lg">Performances</div>
			{#if event.performances}
				<div class="flex flex-col gap-1 divide-y-2 divide-primary">
					<EventPerformances {event} />
				</div>
			{/if}
		</div>
	</div>
{/if}
