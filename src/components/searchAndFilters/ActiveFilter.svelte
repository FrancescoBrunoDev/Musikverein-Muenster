<script lang="ts">
	import {
		removeFilterElement,
		changeFilterPersonOrComposer,
		isAFilterDragged,
		isMoveToActive
	} from '$stores/storeFilters';
	import { createTooltip, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import { Circle } from 'lucide-svelte';
	import ButtonMoveFilterTo from './ButtonMoveFilterTo.svelte';

	export let filter: Filter;
	export let method: Method;
	const possibleMethods: Method[] = ['or', 'and', 'not'];
	const {
		elements: { trigger, content },
		states: { open }
	} = createTooltip({
		positioning: {
			placement: 'bottom-start'
		},
		openDelay: 200,
		closeDelay: 100,
		closeOnPointerDown: true,
		forceVisible: true
	});

	let isDragging = false;
	function handleDragStart(event: DragEvent) {
		isAFilterDragged.set(true);
		// change the style of the pointer to grab
		const thisMethod = method;
		isDragging = true;
		event.dataTransfer?.setData('text/plain', JSON.stringify({ filter, thisMethod }));
	}

	function handleDragEnd(event: DragEvent) {
		isDragging = false;
	}

	let isMouseOver = false;
</script>

<div
	use:melt={$trigger}
	draggable={true}
	on:dragstart={handleDragStart}
	on:dragend={handleDragEnd}
	role="button"
	tabindex="0"
	class="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-background hover:z-20 hover:drop-shadow-lg {isDragging
		? 'cursor-grabbing'
		: 'cursor-grab'}"
>
	{#if method === 'or' || method === 'and'}
		<Circle class="-ml-1" fill={filter.color} size={10} stroke-opacity={0} />
	{/if}
	<button
		type="button"
		class="max-w-xs truncate hover:line-through transition-all"
		on:click={() => removeFilterElement(filter, method)}
		on:mouseover={() => (isMouseOver = true)}
		on:mouseleave={() => (isMouseOver = false)}
		on:blur={() => (isMouseOver = false)}
		on:focus={() => (isMouseOver = true)}
		on:dragover={() => (isMouseOver = true)}
	>
		<span>
			{#if typeof filter.name === 'object'}
				{#if 'lastName' in filter.name}
					{#if filter.entity === 'person' || filter.entity === 'composer'}
						{filter.name.lastName}, {#if isMouseOver}{filter.name.firstName}{:else}{filter.name
								.abbreviatedFirstName}{/if}
						{#if filter.birth && filter.death}
							({filter.birth.split('-')[0]} - {filter.death.split('-')[0]})
						{/if}
					{/if}
				{:else if 'title' in filter.name && filter.entity === 'work'}
					{filter.name.title}, {filter.name.composer.lastName}
					{#if isMouseOver}, {filter.name.composer.abbreviatedFirstName}{/if}
				{/if}
			{:else}
				{filter.name}
			{/if}
		</span>
	</button>
	{#if $open && !isDragging}
		<div use:melt={$content} transition:fade={{ duration: 100 }} class="flex flex-col gap-y-1">
			{#if filter.entity === 'person' || filter.entity === 'composer'}
				<ul
					class="flex flex-initial flex-col gap-y-1 rounded-xl bg-primary p-1 text-xs hover:scale-hover"
				>
					<li>
						<button
							on:click={() => changeFilterPersonOrComposer(filter, method)}
							class="w-full rounded-full bg-background px-2 pb-[0.13rem] transition-transform duration-100 hover:scale-hover hover:shadow-lg"
							>as a {#if filter.entity === 'person'}composer{:else if filter.entity === 'composer'}performer{/if}</button
						>
					</li>
				</ul>
			{/if}
			{#if $isMoveToActive}
				<ul
					class="flex flex-initial flex-col gap-y-1 rounded-xl bg-primary p-1 text-xs hover:scale-hover"
				>
					{#each possibleMethods as possibleMethod}
						{#if possibleMethod !== method}
							<ButtonMoveFilterTo {filter} {method} moveTo={possibleMethod} />
						{/if}
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>
