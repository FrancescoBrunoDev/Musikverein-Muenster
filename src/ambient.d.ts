type MuensterEventsAndChildLocation = {
	location: {
		[key: string]: {
			childs: {
				location: string;
			}[];
		};
	};
};

type DataRecordChart = [
	{
		name: string;
		data: DataRecordCoordinates[];
	}
];

type DataRecordCoordinates = { x: number; filters: {}; eventCount: number };

type filtersCount = {
	[key: string]: number;
};

type Entities = 'series' | 'location' | 'corporation' | 'person' | 'work';

type AutocompleteResult = [string, string, string];

type Store = {
	selectedPerson: AutocompleteResult[];
};

type Person = {
	person: number;
	subject?: number; // Optional subject property
	order: number;
};

type Composer = {
	person: number;
};

type Medium = {
	subject: number;
};

type Performance = {
	work: number;
	order: number;
	composers: Composer[];
	persons: (Person & { mediums?: Medium[] })[]; // Person with optional mediums
};

type EventItem = {
	dates: DateObject[];
	persons: Person[];
	performances: Performance[];
};

type Events = {
	[key: string]: EventItem[];
};

type Filters = {
	and: Filter[];
	or: Filter[];
};

type Method = 'or' | 'not';

type Filter = {
	name: string;
	entity: string;
	id: string;
	color: string;
};

type ItemFilterForGraph = {
	x: number;
	filters: {
		[key: string]: {
			count: number;
			color: string;
		};
	};
	eventCount: number;
};

type workTitles = {
	title: string;
};

type personTitles = {
	title: string;
};

type locationTitles = {
	title: string;
};

type corporationTitles = {
	title: string;
};

type FilteredEventsForGraph = ItemFilterForGraph[];
