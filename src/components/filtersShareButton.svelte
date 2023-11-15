<script lang="ts">
	import { filtersUrlified, urlifyerFilters } from '$stores/storeFilters';
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

	$: console.log('isMouseOver:', isMouseOver);
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button
	on:mouseover={handleMouseOver}
	on:mouseout={handleMouseOut}
	aria-label="Toggle italic"
	class="z-30 flex h-10 w-fit min-w-[2.5rem] flex-row items-center justify-center gap-1 rounded-xl bg-secondary px-2 drop-shadow transition-all hover:scale-hover hover:drop-shadow-xl dark:bg-primary"
	on:click={() => handleClick()}
>
	{#if isMouseOver}<span class="pl-1">{text}</span>
	{/if}<Share />
</button>
