<script lang="ts">
	import { changeFilterPersonOrComposer } from '$stores/storeGraph';
	import { removeFilterElement } from '$stores/storeFilters';
	import { createTooltip, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import { Circle } from 'lucide-svelte';

	export let filter: Filter;
	export let method: string;

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
	class="flex items-center gap-1 rounded-full border border-primary py-1 pl-1 pr-3 text-xs text-primary hover:z-20 hover:drop-shadow-lg"
>
	<Circle class="ml-1" fill={filter.color} size={10} stroke-opacity={0} />
	<button
		type="button"
		id={filter.id}
		class="max-w-xs truncate hover:line-through"
		on:click={() => removeFilterElement(filter.id, method)}
	>
		{filter.name}
	</button>
	{#if $open}
		<ul
			use:melt={$content}
			transition:fade={{ duration: 100 }}
			class="flex flex-initial flex-col gap-y-[0.15rem] text-xs"
		>
			{#if filter.entity === 'person' || filter.entity === 'composer'}
				<li>
					<button
						on:click={() => changeFilterPersonOrComposer(filter.id, filter.entity)}
						class="rounded-full bg-foreground px-2 pb-[0.13rem] text-secondary transition-transform duration-100 hover:scale-[1.03] hover:shadow-lg"
						>as a {#if filter.entity === 'person'}performer{:else if filter.entity === 'composer'}composer{/if}</button
					>
				</li>
			{/if}
			<li>
				<button
					class="rounded-full bg-destructive px-2 text-secondary transition-transform duration-100 hover:scale-[1.03] hover:shadow-lg dark:text-primary"
					>move to {method == 'or' ? 'not' : 'or'}</button
				>
			</li>
		</ul>
	{/if}
</div>
