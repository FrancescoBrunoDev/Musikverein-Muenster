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

<div class={isEventOpen ? 'flex h-fit w-80 flex-shrink-0 flex-col border-2 border-primary' : ''}>
	<button
		on:click={() => handleClickEvent()}
		class={`flex-shrink-0 flex-grow-0 border-primary font-bold ${
			isEventOpen ? 'relative left-0 right-0 top-0 h-fit border-b-2' : 'h-32 w-24 border-2'
		}`}
		>{date}
		{#if isEventOpen}
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
			</span>
		{/if}
	</button>
	{#if isEventOpen}
		<div class="p-2">
			<div class="text-lg font-bold">Performances</div>
			{#if event.performances}
				<div class="flex flex-col gap-1 divide-y-2 divide-primary">
					<EventPerformances {event} />
				</div>
			{/if}
		</div>
	{/if}
</div>
