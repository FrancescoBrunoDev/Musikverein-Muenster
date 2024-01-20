<script lang="ts">
    import LL from '$lib/i18n/i18n-svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';
	import { Minimize2 } from 'lucide-svelte';
	import { showInfoSearch } from '$stores/storeSearchSection';

	function closeModal() {
		$showInfoSearch = false;
	}
</script>

<div
	transition:fade={{ duration: 300 }}
	class="z-50 fixed bottom-0 left-0 right-0 top-0 flex h-screen w-screen items-center justify-center backdrop-blur backdrop-brightness-75"
>
	<div
		in:fly={{ y: 100, duration: 400, easing: cubicOut }}
		out:fly={{ y: -50, duration: 300, easing: cubicIn }}
		class="z-10 grid w-full justify-items-stretch gap-2 px-2 md:w-3/4 md:px-0"
	>
		<button
			on:click={closeModal}
			class="flex h-8 w-8 items-center justify-center justify-self-end rounded-xl bg-background p-2 transition-all hover:scale-hover hover:drop-shadow-xl"
		>
			<Minimize2 />
		</button>
		<div class="rounded-xl bg-background p-2">
			<h3 class="text-lg font-bold">{$LL.filters.infoSearch.title()}</h3>
			<p>{$LL.filters.infoSearch.description()}</p>
		</div>
	</div>
</div>
