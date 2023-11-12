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

type DataRecordCoordinates = { x: number; filters: FiltersForGraph; eventCount: number };

type FiltersForGraph = {
	[key: string]: FilterForGraph;
};

type FilterForGraph = {
	count?: number;
	color?: string;
};

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

type EventPerformance = {
	work: number;
	order: number;
	composers: Composer[];
	persons: (Person & { mediums?: Medium[] })[]; // Person with optional mediums
};

type EventLocation = {
	location: number;
};

type EventItem = {
	uid: number;
	locations: EventLocation[];
	dates: DateObject[];
	persons: Person[];
	performances: EventPerformance[];
	corporations: Corporation[];
	metchAnd?: boolean;
};

type Events = {
	[key: string]: EventItem[];
	timestamp?: string;
};

type Filters = {
	and: Filter[];
	or: Filter[];
	not: Filter[];
};

type Method = 'or' | 'not' | 'and';

type Filter = {
	name: string;
	entity: string;
	id: number;
	color: string;
};

type Titles = {
	title: string;
};

type KindKey = 'performances' | 'persons' | 'locations' | 'corporations';

type KindType = 'work' | 'person' | 'location' | 'corporation';

type allTitles = {
	work: Titles[];
	person: Titles[];
	location: Titles[];
	corporation: Titles[];
	timestamp?: string;
};

type Locales = Locales;

type ThemeKind = 'base' | 'dark';