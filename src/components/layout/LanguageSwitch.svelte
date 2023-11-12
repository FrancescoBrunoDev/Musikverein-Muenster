<script lang="ts">
	import { createToggle, melt } from '@melt-ui/svelte';

	export let value: Locales;
	export let handleLocaleChange: any;

	const {
		elements: { root }
	} = createToggle({
		onPressedChange: handleLocaleChange
	});
</script>

<button
	use:melt={$root}
	aria-label="Toggle italic"
	class="h-10 w-10 rounded-xl bg-secondary text-primary transition-all hover:scale-105 hover:drop-shadow-xl dark:bg-primary dark:text-secondary"
>
	{value === 'en' ? 'de' : 'en'}
</button>
