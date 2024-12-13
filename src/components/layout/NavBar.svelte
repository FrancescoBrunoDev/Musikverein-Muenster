<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import { X } from 'lucide-svelte';
	import LanguageSwitch from '$components/layout/LanguageSwitch.svelte';
	import ThemeSwitch from '$components/layout/ThemeSwitch.svelte';
	import { page } from '$app/stores';

	let isHomePage = $derived($page.url.pathname === '/');

	async function getExibitions() {
		const response = await fetch('/api/exibitions/getMarkdown');
		const exibitions: ExibitionMarkdown[] = await response.json();
		return exibitions;
	}

	const { value, handleLocaleChange } = $props<{ value: Locales; handleLocaleChange: any }>();

	let isMenuActive = $state(false);

	function toggleMenu() {
		isMenuActive = !isMenuActive;
	}
</script>

<div
	class="fixed top-0 z-40 flex h-10 w-full items-center justify-center {isHomePage
		? 'text-background text-white'
		: 'bg-background text-primary'}"
>
	<div class="container flex justify-between text-lg">
		<ul class="flex items-center">
			{#if !isHomePage}
				<li>
					<a class="font-bold" href="/">{$LL.navbar.home()}</a>
				</li>
			{/if}
		</ul>
		<button onclick={() => toggleMenu()} class="flex gap-3 font-bold hover:scale-hover"
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
				class="left-50 absolute bottom-0 right-0 top-0 z-50 left-0 lg:drop-shadow-2xl lg:left-[unset] lg:w-[850px] flex h-dvh flex-col bg-background pb-10 pl-10 text-primary"
			>
				<button
					onclick={() => toggleMenu()}
					class="mr-10 mt-20 self-end hover:scale-hover hover:drop-shadow-2xl md:mr-20"
				>
					<X strokeWidth={2.5} size={50} color="hsl(var(--text)" /></button
				>
				<div class="flex h-full items-end justify-between pr-10 md:pr-20 container">
					<div
						class="flex h-full items-center gap-6 text-5xl font-bold sm:text-6xl md:items-end md:text-7xl lg:text-8xl"
					>
						<div class="grid grid-cols-1">
							<a
								class="transition-transform duration-75 hover:-translate-y-1"
								onclick={() => toggleMenu()}
								href="/timeline">{$LL.navbar.timeline()}</a
							>

							<a
								class="group transition-transform duration-75 hover:-translate-y-1"
								onclick={() => toggleMenu()}
								href="/exibitions">{$LL.navbar.exibitions()}</a
							>
							<ul class="pl-5">
								{#await getExibitions()}
									<div></div>{:then exibitions}
									{#each exibitions as exibition}
										<li class="text-xl transition-transform duration-75 hover:-translate-y-1">
											<a onclick={() => toggleMenu()} href="/exibitions/{exibition.slug}"
												>{exibition.title}</a
											>
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
