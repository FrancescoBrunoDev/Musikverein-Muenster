<script lang="ts">
	import { filtersUrlified, urlifyerFilters, filters } from '$stores/storeFilters';
	import { Share } from 'lucide-svelte';

	let isMouseOver: boolean = false;

	let text: string = 'share your filters';

	function handleClick() {
		urlifyerFilters();
		navigator.clipboard.writeText(`${window.location.origin}/timeline/${$filtersUrlified}`);
		// change the text of the button to "copied in clipboard" and put the check emoji
		text = 'copied in clipboard 🎉';
	}
	function handleMouseOver() {
		isMouseOver = true;
		text = 'share your filters';
	}
	function handleMouseOut() {
		// await one second
		isMouseOver = false;
	}
</script>

{#if $filters.or.length > 0 || $filters.and.length > 0 || $filters.not.length > 0}
	<button
		on:mouseover={handleMouseOver}
		on:mouseout={handleMouseOut}
		on:focus={handleMouseOver}
		on:blur={handleMouseOut}
		on:click={handleClick}
		aria-label="Toggle italic"
		class="z-30 flex h-fit w-fit min-w-[2.5rem] flex-row items-center justify-center gap-1 rounded-xl bg-primary p-2 text-background drop-shadow transition-all hover:scale-hover hover:drop-shadow-xl"
	>
		{#if isMouseOver}<span class="pl-1 text-sm">{text}</span>
		{/if}<Share size={20} />
	</button>
{/if}
