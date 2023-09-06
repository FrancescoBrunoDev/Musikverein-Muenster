type MuensterEventsAndChildLocation = {
	location: {
		[key: string]: {
			childs: {
				location: string;
			}[];
		};
	};
};
ƒ;
type DataRecordChart = [
	{
		name: string;
		data: DataRecordCoordinates[];
	}
];

type DataRecordCoordinates = { x: number; y: number };

type Entities =
	| 'event'
	| 'series'
	| 'location'
	| 'corporation'
	| 'person'
	| 'work'
	| 'source'
	| 'subject';

type AutocompleteResult = [string, string, string];

type Store = {
	selectedPerson: AutocompleteResult[];
};
