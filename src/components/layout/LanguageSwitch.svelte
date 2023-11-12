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
	class="hover:scale-hover h-10 w-10 rounded-xl bg-secondary transition-all hover:drop-shadow-xl dark:bg-primary"
>
	{value === 'en' ? 'de' : 'en'}
</button>
