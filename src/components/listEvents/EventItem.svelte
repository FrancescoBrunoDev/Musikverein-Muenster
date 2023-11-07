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

<div
	class={`w-fit ${
		isEventOpen
			? 'flex h-fit flex-shrink-0 flex-col border-2 border-primary dark:border-secondary'
			: ''
	}`}
>
	<button
		on:click={() => handleClickEvent()}
		class={`flex-shrink-0 flex-grow-0 border-primary font-bold dark:border-secondary ${
			isEventOpen
				? 'relative left-0 right-0 top-0 h-fit w-80 border-b-2 py-2'
				: 'h-32 w-24 border-2'
		}`}
		>{date}
		{#if isEventOpen}
			<br />
			<span class="text-sm dark:font-semibold">
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
		<div class="w-80 p-2">
			<div class="w-full text-lg font-bold dark:font-semibold">Performances</div>
			{#if event.performances}
				<div class="flex flex-col gap-1 divide-y-2 divide-primary dark:divide-secondary">
					<EventPerformances {event} />
				</div>
			{/if}
		</div>
	{/if}
</div>
