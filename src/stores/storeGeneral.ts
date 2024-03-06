import { writable } from 'svelte/store';

const showModal = writable<boolean>(false);
const urlBaseAPIMusiconn = 'https://performance.musiconn.de/api';

export { showModal, urlBaseAPIMusiconn };
