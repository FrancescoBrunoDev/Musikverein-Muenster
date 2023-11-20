<script lang="ts">
	import { moveFilterElement } from '$stores/storeFilters';
	import { ArrowLeftRight } from 'lucide-svelte';

	export let method: Method;
	export let filter: Filter;
	export let moveTo: Method;
</script>

<li>
	<button
		on:click={() => moveFilterElement(filter, method, moveTo)}
		class="flex w-full items-center justify-between gap-1 rounded-full bg-background px-2 transition-transform duration-100 hover:scale-hover hover:shadow-lg dark:text-primary"
	>
		move to {moveTo}<ArrowLeftRight size={10} /></button
	>
</li>
