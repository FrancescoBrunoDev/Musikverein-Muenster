<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { createRadioGroup, melt } from '@melt-ui/svelte';
	import { UpdateSelectedMethodFilter } from '$stores/storeFilters';
	import { Filter, ChevronLeft } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';

	$: isOpen = false;
	const {
		elements: { root, item },
		states: { value }
	} = createRadioGroup({
		defaultValue: 'and'
	});
	$: {
		UpdateSelectedMethodFilter($value as Method);
	}
</script>

<div class="flex items-center">
	{#if !isOpen}
		<button
			class="hover:scale-hover"
			in:fly={{ x: -10, duration: 200, easing: quintInOut }}
			on:click={() => (isOpen = !isOpen)}><Filter size={20} strokeWidth={3} /></button
		>
	{/if}
	{#if isOpen}
		<div
			in:fly={{ x: -10, duration: 200, easing: quintInOut }}
			use:melt={$root}
			class="group flex place-items-center items-center justify-center gap-1 font-bold"
		>
			<button
				use:melt={$item('or')}
				class="undeline uppercase {$value === 'or' ? 'underline' : 'no-underline'} decoration-4"
				>{$LL.filters.methods.or()}</button
			>
			<button
				use:melt={$item('and')}
				class="undeline uppercase {$value === 'and' ? 'underline' : 'no-underline'} decoration-4"
				>{$LL.filters.methods.and()}</button
			>
			<button
				use:melt={$item('not')}
				class="undeline uppercase {$value === 'not' ? 'underline' : 'no-underline'} decoration-4"
				>{$LL.filters.methods.not()}</button
			>
			<button class="hover:scale-hover" on:click={() => (isOpen = !isOpen)}
				><ChevronLeft size={20} strokeWidth={3} /></button
			>
		</div>
	{/if}
</div>
