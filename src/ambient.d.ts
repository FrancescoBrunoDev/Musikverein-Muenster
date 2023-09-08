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

type DataRecordCoordinates = { x: number; y: number; y1: number, y2: number };

type Entities =
  | "event"
  | "series"
  | "location"
  | "corporation"
  | "person"
  | "work"
  | "source"
  | "subject";

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
  [key: number]: Filter;
};

type Filter = {
  name: string;
  entity: string;
  id: string;
};
