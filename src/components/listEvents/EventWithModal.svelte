<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import EventPerformances from './EventPerformances.svelte';
	import {
		getTitles,
		getTitleString,
		getCountersForEvent,
		getFormattedDate
	} from '$stores/storeEvents';
	import { filters } from '$stores/storeFilters';
	import { Circle, FileInput } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import Modal from '$components/ui/Modal.svelte';
	import { onDestroy } from 'svelte';

	let { event }: { event: EventItem } = $props();

	let date: string = $derived.by(() => getFormattedDate({ event }));
	let isEventOpen = $state(false);
	let filtersArrayWithCounter: {
		[key: string]: {
			counter: number;
			color: string;
		};
	} = $derived.by(() => getCountersForEvent({ event }));

	function handleClickEvent() {
		isEventOpen = !isEventOpen;
		if (isEventOpen) {
			getTitles(event);
		}
	}
</script>

<div
	class={cn(
		`relative flex w-fit flex-col justify-center gap-2 overflow-hidden rounded-xl border-2 text-primary transition-all duration-100 hover:scale-hover`
	)}
>
	<button
		onclick={() => handleClickEvent()}
		class={cn(
			`h-32 w-24 flex-shrink-0 flex-grow-0 font-bold transition-all duration-100 ease-in-out`
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

<Modal isOpen={isEventOpen}>
	<div
		class={cn(
			`flex h-full w-full flex-col rounded-xl bg-background text-primary transition-all duration-100`
		)}
	>
		<div
			class={cn(
				`sticky left-0 right-0 top-0 h-fit rounded-xl bg-background p-2 font-bold transition-all duration-100 ease-in-out`
			)}}
		>
			<div class="pb-2 text-center">
				{ate}}
				<div class="dark:font-semibold">
					{#if vent.locations}}{#each vent.locations as location}{#await etTitleString(location.location, 'location')}}
								<div>loading</div>
							{:then title}
								<div transition:fly={ y: 10, duration: 100, delay: 200 }}}>{itle}}</div>
							{:catch error}
								<div>Error: {rror.message}}</div>
							{/await}
						{/each}
					{/if}
				</div>
			</div>
			{#if vent.corporations}}<div class="flex flex-col gap-1">
					<div>
						<div class="text-base font-bold dark:font-semibold">
							{LL.filters.entities.corporation()}}
						</div>
						{#each vent.corporations as corporation}{#if orporation.subject == 2}}{#await etTitleString(corporation.corporation, 'corporation')}}
									<div>loading</div>
								{:then title}
									<div class="flex items-center gap-1">
										{#each bject
											.values($filters)
											.flat() as filter}{#if ilter.entity === 'corporation' && filter.id == corporation.corporation}}<Circle
													class="flex-shrink-0"
													fill={ilter.color}}
													size={0}}
													stroke-opacity={}}
												></Circle>
											{/if}
										{/each}
										<span class="text-sm">{itle}}</span>
									</div>
								{:catch error}
									<div>Error: {rror.message}}</div>
								{/await}
							{/if}
						{/each}
					</div>
					<div class="flex w-fit items-center gap-2">
						<div class="text-base font-bold dark:font-semibold">
							{LL.filters.entities.source()}}
						</div>
						{#each vent.sources as source}{#if ource.url}}<a
									class="hover:scale-hover"
									href={ource.url}}
									target="_blank"
									rel="noopener noreferrer"
								>
									<FileInput strokeWidth={.25}}></FileInput>
								</a>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
		<div class="flex flex-col gap-4 overflow-y-scroll p-2">
			<div class="rounded-xl border-2 p-2">
				<div class="w-full text-base font-bold dark:font-semibold">
					{LL.filters.entities.performances()}}
				</div>
				{#if vent.performances}}<div class="divide flex flex-col gap-1 divide-y-2 dark:font-light">
						<EventPerformances {event}></EventPerformances>
					</div>
				{/if}
			</div>
		</div>
	</div>
</Modal>
