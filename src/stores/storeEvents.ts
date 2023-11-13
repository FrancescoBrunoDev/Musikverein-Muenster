import { writable } from 'svelte/store';

const fetchedEvents = writable<Events>(undefined);
const allTitles = writable<allTitles>();

const getTitle = (uid: number, kind: Entity): Promise<string> => {
	return new Promise((resolve, reject) => {
		let _allTitles: allTitles = {
			work: {},
			person: {},
			location: {},
			corporation: {}
		};
		const unsubscribe = allTitles.subscribe((res) => {
			_allTitles = res;
			const titles = _allTitles[kind];
			const titleObj = titles[uid];
			if (titleObj) {
				resolve(titleObj.title);
				unsubscribe();
			}
		});
		if (!unsubscribe) {
			reject('Unable to subscribe');
		}
	});
};

export { fetchedEvents, allTitles, getTitle };
