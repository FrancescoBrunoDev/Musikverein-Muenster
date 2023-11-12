<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import { toggleDarkMode } from '$stores/storeTheme';
	import { ArrowRight } from 'lucide-svelte';
	import { Lightbulb } from 'lucide-svelte';
	import LanguageSwitch from '$components/layout/LanguageSwitch.svelte';
	import ThemeSwitch from '$components/layout/ThemeSwitch.svelte';

	export let value: Locales;
	export let handleLocaleChange: any;

	let isMenuActive = false;

	function toggleMenu() {
		isMenuActive = !isMenuActive;
	}
</script>

<div class="fixed top-0 z-50 flex h-10 w-full items-center justify-center bg-background">
	<div class="container flex justify-between text-lg text-foreground">
		<ul class="flex items-center">
			<li>
				<a class="font-bold" href="/">{$LL.home()}</a>
			</li>
		</ul>
		<button on:click={() => toggleMenu()} class="flex gap-3 font-bold hover:scale-105">{$LL.menu()}</button>
		{#if isMenuActive}
			<div
				transition:fly={{
					delay: 50,
					duration: 1000,
					x: 1500,
					easing: quintInOut
				}}
				class="absolute bottom-0 left-50 left-0 right-0 top-0 z-50 flex h-screen flex-col bg-background pb-10 pl-10 text-primary"
			>
				<button on:click={() => toggleMenu()} class="mr-20 mt-20 self-end hover:scale-105">
					<ArrowRight size={100} color="hsl(var(--primary)" /></button
				>
				<div class="flex h-full items-end justify-between pr-20">
					<div class="flex h-full items-end gap-6 text-8xl font-bold">
						<div class="grid grid-cols-1">
							<a
								class="transition-transform duration-75 hover:-translate-y-1"
								on:click={() => toggleMenu()}
								href="/timeline">Timeline</a
							>

							<a
								class="group transition-transform duration-75 hover:-translate-y-1"
								on:click={() => toggleMenu()}
								href="/austellung">Austellung</a
							>
							<ul class="pl-5">
								<li class="text-xl transition-transform duration-75 hover:-translate-y-1">
									1# First Exibition
								</li>
							</ul>
						</div>
					</div>
					<div class="flex flex-col gap-y-2">
						<LanguageSwitch {value} {handleLocaleChange} />
						<ThemeSwitch />
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
