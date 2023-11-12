<script lang="ts">
	import '$tailwind';
	import NavBar from '$components/layout/NavBar.svelte';
	import { checkIfThemeDataExists, setFirstThemeData } from '$stores/storeTheme';
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';

	let value: Locales = 'en';

	async function handleLocaleChange() {
		value = value === 'en' ? 'de' : 'en';
		console.log(value);
		await loadLocaleAsync(value);
		setLocale(value);
		sessionStorage.setItem('lang', value);
	}

	onMount(() => {
		const valueFromSession = sessionStorage.getItem('lang') || 'en';
		value = valueFromSession as Locales;
		sessionStorage.setItem('lang', valueFromSession);
	});

	onDestroy(() => {
		if (browser) {
			sessionStorage.removeItem('lang');
		}
	});

	// at first load, set dark mode if the user prefers it
	const _checkIfThemeDataExists = checkIfThemeDataExists();

	if (_checkIfThemeDataExists == 'dark' || _checkIfThemeDataExists == 'base') {
		setFirstThemeData();
	}
</script>

<div class="subpixel-antialiased">
	<div class="grid h-screen justify-items-center">
		<NavBar {value} {handleLocaleChange} />
		<slot />
	</div>
</div>
