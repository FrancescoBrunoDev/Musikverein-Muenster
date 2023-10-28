<script lang="ts">
	import '$tailwind';
	import NavBar from '$components/layout/NavBar.svelte';
	import { checkIfThemeDataExists, setFirstThemeData } from '$stores/storeTheme';

	// at first load, set dark mode if the user prefers it
	const _checkIfThemeDataExists = checkIfThemeDataExists();

	if (_checkIfThemeDataExists == 'dark' || _checkIfThemeDataExists == 'base') {
		setFirstThemeData();
	}
</script>

<div class="">
	<div class="grid h-screen justify-items-center">
		<NavBar />
		<slot />
	</div>
</div>
