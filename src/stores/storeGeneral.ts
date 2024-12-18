import { persistStore } from '$utils/storeUtils';

const urlBaseAPIMusiconn = 'https://performance.musiconn.de/api';

const locale = persistStore<Locales>('lang', 'en');

export { locale, urlBaseAPIMusiconn };
