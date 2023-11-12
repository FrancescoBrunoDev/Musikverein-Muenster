import { writable } from 'svelte/store';

const fetchedEvents = writable<Events>(undefined);
const allTitles = writable<allTitles>();

const getTitle = (uid: number, kind: Entity) => {
	let _allTitles: { [key in Entity]: { [key: number]: { title: string } } } = {
		work: {},
		person: {},
		location: {},
		corporation: {}
	};
	allTitles.subscribe((res) => {
		_allTitles = res;
	});

	const titles = _allTitles[kind];
	const titleObj = titles[uid];
	return titleObj ? titleObj.title : 'Title not found';
};

export { fetchedEvents, allTitles, getTitle };
