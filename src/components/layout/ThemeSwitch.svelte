<script lang="ts">
	import { toggleDarkMode, themeKind } from '$stores/storeTheme';
	import { createToggle, melt } from '@melt-ui/svelte';
	import { draw } from 'svelte/transition';
	import { expoInOut } from 'svelte/easing';

	function toggleMenu() {
		toggleDarkMode();
	}

	const {
		elements: { root }
	} = createToggle({
		onPressedChange: toggleMenu
	});
</script>

<button
	use:melt={$root}
	aria-label="Toggle italic"
	class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary transition-all hover:scale-hover hover:drop-shadow-xl"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-sun-medium"
	>
		{#if $themeKind === 'dark'}
			<path
				in:draw={{ duration: 1000, easing: expoInOut, delay: 500 }}
				out:draw={{ duration: 1000, easing: expoInOut }}
				d="M 2 12 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0"
				transform="translate(12, 12) rotate(90) translate(-12, -12)"
			/>
		{:else}<path
				in:draw={{ duration: 1000, easing: expoInOut, delay: 500 }}
				out:draw={{ duration: 1000, easing: expoInOut }}
				d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
			/>
		{/if}</svg
	>
</button>
