import { LocalStorage } from '$lib/storage.svelte';
import { browser } from '$app/environment';

const urlBaseAPIMusiconn = $state('https://performance.musiconn.de/api');

let locale = new LocalStorage<Locales>('lang', 'en');
let themeKind = new LocalStorage<ThemeKind>('theme', 'base');

function setFirstThemeData() {
    if (browser) {
        if (themeKind.current === 'dark') {
            document.body.classList.remove('base');
            document.body.classList.add('dark');
        } else if (themeKind.current === 'base') {
            document.body.classList.remove('dark');
            document.body.classList.add('base');
        }
    }
};

function toggleTheme() {
    if (browser) {
        if (themeKind.current === 'dark') {
            themeKind.current = 'base';
            document.body.classList.remove('dark');
            document.body.classList.add('base');
        } else if (themeKind.current === 'base') {
            themeKind.current = 'dark';
            document.body.classList.remove('base');
            document.body.classList.add('dark');
        }
    }
}

export { locale, themeKind, toggleTheme, setFirstThemeData, urlBaseAPIMusiconn };
