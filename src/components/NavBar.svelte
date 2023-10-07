<script>
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import ArrowRight from 'svelte-material-icons/ArrowRight.svelte';
	import { toggleDarkMode } from '$stores/storeTheme';

	let isMenuActive = false;

	function toggleMenu() {
		isMenuActive = !isMenuActive;
	}
</script>

<div class="fixed top-0 z-50 flex h-10 w-full items-center justify-center">
	<div class="text-foreground container flex justify-between text-lg">
		<ul class="flex items-center">
			<li>
				<a class="font-bold" href="/">Home</a>
			</li>
		</ul>
		<button on:click={() => toggleMenu()} class="flex gap-3 font-bold hover:scale-105">Menu</button>
		{#if isMenuActive}
			<div
				transition:fly={{
					delay: 50,
					duration: 1000,
					x: 1500,
					easing: quintInOut
				}}
				class="text-primary bg-background/90 absolute bottom-0 left-0 right-0 top-0 z-50 flex h-screen flex-col pb-10 pl-10 drop-shadow backdrop-blur-md"
			>
				<button on:click={() => toggleMenu()} class="mr-20 mt-20 self-end hover:scale-105">
					<ArrowRight size={100} color="hsl(var(--primary)" /></button
				>
				<div class="flex h-full items-end justify-between">
					<div class="flex h-full items-end gap-6 text-6xl font-bold">
						<div class="grid grid-cols-1">
							<a on:click={() => toggleMenu()} href="/timeline">Timeline</a>
							<a on:click={() => toggleMenu()} href="/austellung">Austellung</a>
						</div>
					</div>
					<button
						on:click={() => {
							toggleDarkMode();
							toggleMenu();
						}}
						class="mr-20 text-lg font-bold">toggle light</button
					>
				</div>
			</div>
		{/if}
	</div>
</div>
