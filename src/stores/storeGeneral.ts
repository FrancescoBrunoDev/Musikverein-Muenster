import { writable } from 'svelte/store';

const showModal = writable<boolean>(false);

export { showModal };