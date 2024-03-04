<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { Settings } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import CheckBox from '$components/CheckBox.svelte';
	import LL from '$lib/i18n/i18n-svelte';
	import { showLinesAsPerformances } from '$stores/storeGraph';
    import { isMoveToActive } from '$stores/storeFilters';

	function handleCheckboxChange() {
		$showLinesAsPerformances = !$showLinesAsPerformances;
	}

	export let marignTop: string;

	const {
		elements: { trigger, menu, item },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true,
		positioning: {
			placement: 'bottom-end'
		}
	});
</script>

<button type="button" class="trigger" use:melt={$trigger} aria-label="Update dimensions">
	<Settings />
	<span class="sr-only">Open Popover</span>
</button>

{#if $open}
	<div
		class="rounded-xl p-2 mt-{marignTop} z-50 divide-y bg-background drop-shadow-xl"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -10 }}
	>
		<div use:melt={$item}>
			<CheckBox
				title={$LL.filters.filter.checkboxPerformanceEvent()}
				on:change={() => ($showLinesAsPerformances = !$showLinesAsPerformances)}
			/>
		</div>
		<div use:melt={$item}>
			<CheckBox title={'show move option on  filter hover'} on:change={() => ($isMoveToActive = !$isMoveToActive)} />
		</div>
	</div>
{/if}
