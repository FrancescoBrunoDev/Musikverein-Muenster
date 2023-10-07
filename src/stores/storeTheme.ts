import { browser } from '$app/environment';

const checkIfThemeDataExists = () => {
	if (browser) {
		const themeData = localStorage.getItem('theme');
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
		if (localStorage.getItem('theme') === 'dark') {
			document.body.classList.remove('base');
			document.body.classList.add('dark');
		} else if (localStorage.getItem('theme') === 'base') {
			document.body.classList.remove('dark');
			document.body.classList.add('base');
		}
	}
};

const toggleDarkMode = () => {
	if (browser) {
		if (localStorage.getItem('theme') === 'dark') {
			document.body.classList.remove('dark');
			document.body.classList.add('base');
			localStorage.setItem('theme', 'base');
		} else if (localStorage.getItem('theme') === 'base') {
			document.body.classList.remove('base');
			document.body.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		}
	}
};

export { toggleDarkMode, checkIfThemeDataExists, setFirstThemeData };
