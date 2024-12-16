<script lang="ts">
	import { getTitles, getCountersForEvent, getFormattedDate } from '$stores/storeEvents';
	import { Circle } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let {
		event,
		selectedEvent = $bindable(),
		isEventOpen = $bindable()
	}: { event: EventItem; selectedEvent: EventItem | null; isEventOpen: boolean } = $props();

	let date: string = $derived.by(() => getFormattedDate({ event }));
	let filtersArrayWithCounter: {
		[key: string]: {
			counter: number;
			color: string;
		};
	} = $derived.by(() => getCountersForEvent({ event }));

	function handleClickEvent() {
		isEventOpen = !isEventOpen;
		selectedEvent = event;
		if (isEventOpen) {
			getTitles(event);
		}
	}
</script>

<div
	class={cn(
		'relative flex w-fit flex-col justify-center gap-2 overflow-hidden rounded-xl border-2 text-primary transition-all duration-100 hover:scale-hover'
	)}
>
	<button
		onclick={() => {
			handleClickEvent();
		}}
		class={cn(
			'h-24 w-24 flex-shrink-0 flex-grow-0 font-bold transition-all duration-100 ease-in-out'
		)}
		>{date}

		<div class="flex flex-wrap justify-center gap-2">
			{#each Object.keys(filtersArrayWithCounter) as key}
				{#if filtersArrayWithCounter[key].counter > 0}
					<span class="flex items-center gap-1 text-sm font-light">
						{filtersArrayWithCounter[key].counter}
						<Circle
							class="flex-shrink-0"
							fill={filtersArrayWithCounter[key].color}
							size={10}
							stroke-opacity={0}
						/>
					</span>
				{/if}
			{/each}
		</div>

		<div class="flex flex-wrap justify-center gap-1"></div>
	</button>
</div>
