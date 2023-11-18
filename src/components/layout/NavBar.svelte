<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import { ArrowRight } from 'lucide-svelte';
	import LanguageSwitch from '$components/layout/LanguageSwitch.svelte';
	import ThemeSwitch from '$components/layout/ThemeSwitch.svelte';

	async function getExibitions() {
		const response = await fetch('api/exibitions/getMarkdown');
		const exibitions: ExibitionMarkdown[] = await response.json();
		console.log(exibitions);
		return exibitions;
	}

	export let value: Locales;
	export let handleLocaleChange: any;

	let isMenuActive = false;

	function toggleMenu() {
		isMenuActive = !isMenuActive;
	}
</script>

<div class="fixed top-0 z-50 flex h-10 w-full items-center justify-center bg-background">
	<div class="container flex justify-between text-lg">
		<ul class="flex items-center">
			<li>
				<a class="font-bold" href="/">{$LL.navbar.home()}</a>
			</li>
		</ul>
		<button on:click={() => toggleMenu()} class="flex gap-3 font-bold hover:scale-hover"
			>{$LL.navbar.menu()}</button
		>
		{#if isMenuActive}
			<div
				transition:fly={{
					delay: 50,
					duration: 1000,
					x: 1500,
					easing: quintInOut
				}}
				class="left-50 absolute bottom-0 left-0 right-0 top-0 z-50 flex h-screen flex-col bg-background pb-10 pl-10"
			>
				<button
					on:click={() => toggleMenu()}
					class="mr-10 mt-20 self-end hover:scale-hover md:mr-20"
				>
					<ArrowRight size={100} color="hsl(var(--text)" /></button
				>
				<div class="flex h-full items-end justify-between pr-10 md:pr-20">
					<div
						class="flex h-full items-center gap-6 text-5xl font-bold sm:text-6xl md:items-end md:text-7xl lg:text-8xl"
					>
						<div class="grid grid-cols-1">
							<a
								class="transition-transform duration-75 hover:-translate-y-1"
								on:click={() => toggleMenu()}
								href="/timeline">{$LL.navbar.timeline()}</a
							>

							<a
								class="group transition-transform duration-75 hover:-translate-y-1"
								on:click={() => toggleMenu()}
								href="/exibitions">{$LL.navbar.exibitions()}</a
							>
							<ul class="pl-5">
								{#await getExibitions()}
									<div></div>{:then exibitions}
									{#each exibitions as exibition}
										<li class="text-xl transition-transform duration-75 hover:-translate-y-1">
											<a href="/exibitions/{exibition.slug}">{exibition.title}</a>
										</li>
									{/each}
								{/await}
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
