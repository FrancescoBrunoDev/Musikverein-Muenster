import { browser } from '$app/environment';
import { setLocale } from '$lib/i18n/i18n-svelte';
import { detectLocale } from '$lib/i18n/i18n-util';
import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
import { navigatorDetector, sessionStorageDetector } from 'typesafe-i18n/detectors';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	if (browser) {
		const deafultLocale = 'en';
		const locale =
			detectLocale(sessionStorageDetector) || detectLocale(navigatorDetector) || deafultLocale;

		await loadLocaleAsync(locale);
		setLocale(locale);
	}
	return event.data;
};
