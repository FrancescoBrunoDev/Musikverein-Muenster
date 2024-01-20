<script lang="ts">
	import { removeFilterElement, changeFilterPersonOrComposer } from '$stores/storeFilters';
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
</script>

<div
	use:melt={$trigger}
	class="flex items-center gap-1 bg-background rounded-full border border-secondary px-3 py-1 text-xs text-secondary hover:z-20 hover:drop-shadow-lg"
>
	{#if method === 'or' || method === 'and'}
		<Circle class="-ml-1" fill={filter.color} size={10} stroke-opacity={0} />
	{/if}
	<button
		type="button"
		class="max-w-xs truncate hover:line-through"
		on:click={() => removeFilterElement(filter, method)}
	>
		{filter.name}
	</button>
	{#if $open}
		<div use:melt={$content} transition:fade={{ duration: 100 }} class="flex flex-col gap-y-1">
			<ul class="flex flex-initial flex-col gap-y-1 rounded-xl bg-secondary p-1 text-xs">
				{#if filter.entity === 'person' || filter.entity === 'composer'}
					<li>
						<button
							on:click={() => changeFilterPersonOrComposer(filter, method)}
							class="rounded-full w-full bg-background px-2 pb-[0.13rem] transition-transform duration-100 hover:scale-hover hover:shadow-lg"
							>as a {#if filter.entity === 'person'}performer{:else if filter.entity === 'composer'}composer{/if}</button
						>
					</li>
				{/if}
			</ul>
			<ul class="flex flex-initial flex-col gap-y-1 rounded-xl bg-secondary p-1 text-xs">
				{#each possibleMethods as possibleMethod}
					{#if possibleMethod !== method}
						<ButtonMoveFilterTo {filter} {method} moveTo={possibleMethod} />
					{/if}
				{/each}
			</ul>
		</div>
	{/if}
</div>
