<script lang="ts">
	import '$tailwind';
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
