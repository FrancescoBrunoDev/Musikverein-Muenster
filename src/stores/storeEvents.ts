import { writable } from 'svelte/store';

const fetchedEvents = writable<Events>(undefined);
const allTitles = writable<allTitles>({
	work: {},
	person: {},
	location: {},
	corporation: {},
	composer: {},
});

const kindMapping: { [key in Entity]: { key: string; uid: string } } = {
	work: { key: 'performances', uid: 'work' },
	person: { key: 'persons', uid: 'person' },
	location: { key: 'locations', uid: 'location' },
	corporation: { key: 'corporations', uid: 'corporation' },
	composer: { key: 'composers', uid: 'person' }
};

const getTitles = async (event: EventItem) => {
	const uidTypes: Entity[] = ['work', 'person', 'location', 'corporation', 'composer'];
	try {
		await Promise.all(
			uidTypes.map(async (kind) => {
				const allUids = (await getUidsPerEntity(kind, event)).map((uid: any) => uid.toString());
				let titlesAlreadyPresent = true;
				allTitles.subscribe((allTitlesMom) => {
					const titles = allUids
						.map((uid: any) => allTitlesMom[kind][uid])
						.filter((title) => title);
					if (titles.length !== allUids.length) {
						titlesAlreadyPresent = false;
					}
				});
				if (!titlesAlreadyPresent) {
					getTitle(allUids, kind);
				}
			})
		);
	} catch (error) {
		console.error(
			'An error occurred while fetching titles, I will try to use the stored Titles:',
		);
	}
};

const getTitle = async (allUids: string[], kind: Entity) => {
	let kindForApi: Entity = kind;
	if (kind === 'composer') {
		kindForApi = 'person';
	}
	const uids = allUids.length > 1 ? allUids.join('|') : allUids[0];
	const res = await fetch(
		`https://performance.musiconn.de/api?action=get&${kindForApi}=${uids}&props=title&format=json`
	);
	const json = await res.json();
	const titles = json[kindForApi];
	allTitles.update((allTitlesMom) => {
		allTitlesMom[kind] = { ...allTitlesMom[kind], ...titles };
		return allTitlesMom;
	});
};

const getUidsPerEntity = async (kind: Entity, event: EventItem) => {
	const uids = new Set();

	const kindKey = kindMapping[kind] ? (kindMapping[kind].key as KindKey) : undefined;
	const uidKey = kindMapping[kind] ? (kindMapping[kind]?.uid as Entity) : undefined;
	if (kindKey && uidKey && event[kindKey]) {
		event[kindKey].forEach((item) => {
			uids.add(item[uidKey]);
		});
	}

	return Array.from(uids);
};

const getTitleString = (uid: number, kind: Entity): Promise<string> => {
	return new Promise((resolve, reject) => {
		let _allTitles: allTitles = {
			work: {},
			person: {},
			location: {},
			corporation: {},
			composer: {}
		};
		const intervalId = setInterval(() => {
			allTitles.subscribe((res) => {
				_allTitles = res;
				const titles = _allTitles[kind];
				const titleObj = titles[uid];
				if (titleObj) {
					clearInterval(intervalId);
					resolve(titleObj.title);
				}
			});
		}, 10); // Check every second
	});
};

export { fetchedEvents, allTitles, getTitleString, getTitles, getTitle };
