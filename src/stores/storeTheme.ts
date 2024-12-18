import { browser } from '$app/environment';
import { persistStore } from '$utils/storeUtils';
import { get } from 'svelte/store';

const themeKind = persistStore<ThemeKind>('theme', 'base');

const checkIfThemeDataExists = () => {
	if (browser) {
		const themeData = get(themeKind);
		if (themeData) {
			return themeData;
		} else {
			localStorage.setItem('theme', 'dark');
			return 'base';
		}
	}
};

const setFirstThemeData = () => {
	if (browser) {
		if (get(themeKind) === 'dark') {
			themeKind.set('dark');
			document.body.classList.remove('base');
			document.body.classList.add('dark');
		} else if (get(themeKind) === 'base') {
			themeKind.set('base');
			document.body.classList.remove('dark');
			document.body.classList.add('base');
		}
	}
};

const toggleDarkMode = () => {
	if (browser) {
		if (get(themeKind) === 'dark') {
			themeKind.set('base');
			document.body.classList.remove('dark');
			document.body.classList.add('base');
		} else if (get(themeKind) === 'base') {
			themeKind.set('dark');
			document.body.classList.remove('base');
			document.body.classList.add('dark');
		}
	}
};

export { checkIfThemeDataExists, setFirstThemeData, themeKind, toggleDarkMode };
