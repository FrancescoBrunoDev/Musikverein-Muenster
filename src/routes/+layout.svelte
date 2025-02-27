<script lang="ts">
	import NavBar from '$components/layout/NavBar.svelte';
	import { setFirstThemeData } from '$states/stateGeneral.svelte';
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
	import { locale } from '$states/stateGeneral.svelte';

	let value: Locales = $state('en');
	let { children } = $props();

	async function handleLocaleChange() {
		value = value === 'en' ? 'de' : 'en';
		await loadLocaleAsync(value);
		setLocale(value);
		locale.current = value;
	}

	onMount(async () => {
		const valueFromSession = locale.current || 'en';
		value = locale.current as Locales;
		await loadLocaleAsync(valueFromSession);
		setLocale(valueFromSession);
		locale.current = valueFromSession;
	});

	onDestroy(() => {
		if (browser) {
			sessionStorage.removeItem('lang');
		}
	});

	// at first load, set dark mode if the user prefers it
	setFirstThemeData();
</script>

<div class="subpixel-antialiased">
	<div class="grid h-screen justify-items-center">
		<NavBar {value} {handleLocaleChange} />
		{@render children?.()}
	</div>
</div>

<style lang="postcss">
	@reference '../app.css';

	@custom-variant dark (&:is(.dark *));

	@layer base {
		:global(:root) {
			--text: 0 60% 1%;
			--background: 0 60% 99%; /* white */
			--primary: 0 60% 1%; /* black */
			--secondary: 240 5.9% 90%;
			--white: 0 60% 99%;
			--accent: 0 51% 46%;
			--destructive: 0 84.2% 60.2%;
			--border: 240 5.9% 90%;
			--ring: 240 5.9% 10%;
			--radius: 0.25rem;
		}

		:global(.dark) {
			--text: 0 60% 99%;
			--background: 0 60% 1%; /* black */
			--primary: 0 60% 99%; /* white */
			--secondary: 240 3.7% 25.9%;
			--white: 0 60% 99%;
			--accent: 0 51% 54%;
			--destructive: 0 62.8% 30.6%;
			--border: 240 3.7% 15.9%;
			--ring: 240 4.9% 83.9%;
			--radius: 0.25rem;
		}

		:global(body) {
			@apply bg-background text-text text-base;
			transition:
				background-color 0.2s ease-in-out,
				color 0.2s ease-in-out;
			font-feature-settings:
				'rlig' 1,
				'calt' 1;
		}

		/* all the border must be color border */
		:global(*, ::after, ::before, ::backdrop, ::file-selector-button) {
			@apply border-border border-solid;
		}
	}

	:global(.scale-hover) {
		@apply scale-103;
	}
</style>
