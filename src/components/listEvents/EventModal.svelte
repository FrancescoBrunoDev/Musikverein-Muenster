<script>
	import Modal from '$components/ui/Modal.svelte';
	import { getTitleString, getFormattedDate } from '$stores/storeEvents';
	import { cn } from '$lib/utils';
	import { Circle, FileInput } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import LL from '$lib/i18n/i18n-svelte';
	import { filters } from '$stores/storeFilters';
	import EventPerformances from './EventPerformances.svelte';

	let { event, isEventOpen = $bindable() } = $props();

	let date = $derived.by(() => getFormattedDate({ event }));
</script>

<Modal bind:isOpen={isEventOpen}>
	<div
		class={cn(
			'flex h-full w-full flex-col rounded-xl bg-background text-primary transition-all duration-100'
		)}
	>
		<div
			class={cn(
				'sticky left-0  right-0 top-0 h-fit rounded-xl bg-background p-2 font-bold transition-all duration-100 ease-in-out'
			)}
		>
			<div class="pb-2 text-center">
				{date}
				<div class="dark:font-semibold">
					{#if event.locations}
						{#each event.locations as location}
							{#await getTitleString(location.location, 'location')}
								<div>loading</div>
							{:then title}
								<div transition:fly={{ y: 10, duration: 100, delay: 200 }}>{title}</div>
							{:catch error}
								<div>Error: {error.message}</div>
							{/await}
						{/each}
					{/if}
				</div>
			</div>
			{#if event.corporations}
				<div class="flex flex-col gap-1">
					<div>
						<div class="text-base font-bold dark:font-semibold">
							{$LL.filters.entities.corporation()}
						</div>
						{#each event.corporations as corporation}
							{#if corporation.subject == 2}
								{#await getTitleString(corporation.corporation, 'corporation')}
									<div>loading</div>
								{:then title}
									<div class="flex items-center gap-1">
										{#each Object.values($filters).flat() as filter}
											{#if filter.entity === 'corporation' && filter.id == corporation.corporation}
												<Circle
													class="flex-shrink-0"
													fill={filter.color}
													size={10}
													stroke-opacity={0}
												/>
											{/if}
										{/each}
										<span class="text-sm">{title}</span>
									</div>
								{:catch error}
									<div>Error: {error.message}</div>
								{/await}
							{/if}
						{/each}
					</div>
					<div class="flex w-fit items-center gap-2">
						<div class="text-base font-bold dark:font-semibold">
							{$LL.filters.entities.source()}
						</div>
						{#each event.sources as source}
							{#if source.url}
								<a
									class="hover:scale-hover"
									href={source.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<FileInput strokeWidth={2.25} />
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
					{$LL.filters.entities.performances()}
				</div>
				{#if event.performances}
					<div class="divide flex flex-col gap-1 divide-y-2 dark:font-light">
						<EventPerformances {event} />
					</div>
				{/if}
			</div>
		</div>
	</div>
</Modal>
