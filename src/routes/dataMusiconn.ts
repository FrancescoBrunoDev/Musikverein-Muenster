import { fetchedEvents, filters } from "../store";

let MuensterID = 307;

const getMuensterEventsAndChildLocation = async () => {
  try {
    const res = await fetch(
      `https://performance.musiconn.de/api?action=get&location=${MuensterID}&props=childs|events&format=json`
    );
    const eventsAndChildsLocations = await res.json();
    return eventsAndChildsLocations;
  } catch (error) {
    console.error("Error fetching events and child locations:", error);
    return {};
  }
};

const getMuensterChildEvents = async (
  muensterEventsAndChildLocation: MuensterEventsAndChildLocation
) => {
  try {
    const eventsAndChildsLocations =
      muensterEventsAndChildLocation.location[MuensterID];

    if (eventsAndChildsLocations && eventsAndChildsLocations.childs) {
      const childLocationIds = eventsAndChildsLocations.childs
        .map((child) => child.location)
        .join("|");

      const res = await fetch(
        `https://performance.musiconn.de/api?action=get&location=${childLocationIds}&props=events&format=json`
      );

      const childEvents = await res.json();
      return childEvents;
    } else {
      console.error("No child events found in the events object.");
    }
  } catch (error) {
    console.error("Error fetching child events:", error);
    return [];
  }
};

const joinMuensterEventAndChildEvents = async () => {
  try {
    const muensterEventsAndChildLocation =
      await getMuensterEventsAndChildLocation();
    const muensterChildEvents = await getMuensterChildEvents(
      muensterEventsAndChildLocation
    );

    if (muensterEventsAndChildLocation && muensterChildEvents) {
      muensterEventsAndChildLocation.location[MuensterID].childs =
        muensterChildEvents;
    }
    return muensterEventsAndChildLocation;
  } catch (error) {
    console.error("Error joining events and child events:", error);
    return [];
  }
};

function extractEventIds(obj: number | object) {
  const eventIds: any[] = [];

  function recursiveExtract(obj: number | object) {
    if (obj && typeof obj === "object") {
      if (obj.event) {
        eventIds.push(obj.event);
      }
      for (const key in obj) {
        recursiveExtract(obj[key]);
      }
    }
  }

  recursiveExtract(obj);
  return eventIds;
}

const getAllEvents = async () => {
  try {
    const muensterWithAllEventAndAllChildsEvent =
      await joinMuensterEventAndChildEvents();
    const allEventIds = extractEventIds(
      muensterWithAllEventAndAllChildsEvent.location[MuensterID]
    );
    const joinedEventIds = allEventIds.join("|");

    const res = await fetch(
      `https://performance.musiconn.de/api?action=get&event=${joinedEventIds}&props=dates|corporations|performances|persons&format=json`
    );
    const allEvents = await res.json();
    return allEvents;
  } catch (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
};

const joinEventByYear = async () => {
  const allEvents = await getAllEvents();
  const eventsByYear = {};

  for (const key in allEvents.event) {
    const event = allEvents.event[key];
    const year = event.dates[0].date.split("-")[0];

    if (eventsByYear[year]) {
      eventsByYear[year].push(event);
    } else {
      eventsByYear[year] = [event];
    }
  }

  return eventsByYear;
};

const dataForGraph = async (eventsByYear: Events[]) => {
  const data: DataRecordCoordinates[] = [];
  const linea: DataRecordChart[] = [
    {
      name: "main",
      data: data,
    },
  ];
  for (const key in eventsByYear) {
    const events = eventsByYear[key];
    const year = Number(key);
    const eventCount = events.length;
    data.push({
      x: year,
      y: eventCount,
    });
  }

  return linea;
};

const filterEventsByYear = async (filtersToFilter: Filters) => {
  let fetchedEventsToFilter = undefined;
  fetchedEvents.subscribe((res) => {
    fetchedEventsToFilter = res;
  });

  const filtersSortedByTypeOnlyId = optimizeAndCombineFilters(filtersToFilter);

  let filteredEvents = {};

  // filter for works
  for (const year in fetchedEventsToFilter) {
    const events = fetchedEventsToFilter[year];
    for (const eventId in events) {
      const performances = events[eventId].performances || [];
      if (performances.length > 0) {
        const hasMatchingPerformance = performances.some((performance) => {
          const workId = performance.work.toString(); // Convert to string for comparison
          const composerId =
            performance.composers && performance.composers.length > 0
              ? performance.composers[0].person.toString()
              : null;
          if (
            filtersSortedByTypeOnlyId.work.includes(workId) ||
            filtersSortedByTypeOnlyId.person.includes(composerId)
          ) {
            return true;
          }
        });
        if (hasMatchingPerformance) {
          filteredEvents[year] = filteredEvents[year] || [];
          try {
            filteredEvents[year].push(events[eventId]);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }

  return filteredEvents;
};

const optimizeAndCombineFilters = (filters) => {
  const filterMap = {};

  for (const filter of filters) {
    const entity = filter.entity;
    const ids = filter.id.split(",").map((id) => id.trim());

    if (filterMap[entity]) {
      filterMap[entity].push(...ids);
    } else {
      filterMap[entity] = ids;
    }
  }

  const combinedFilters = {
    work: [],
    person: [],
  };
  for (const entity in filterMap) {
    combinedFilters[entity] = filterMap[entity];
  }

  return combinedFilters;
};

const autocomplete = async (query: string) => {
  try {
    const res = await fetch(
      `https://performance.musiconn.de/api?action=autocomplete&title=${query}&entities=corporation|person|work&project=26&format=json`
    );
    const results = await res.json();

    return results;
  } catch (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
};

export { dataForGraph, autocomplete, joinEventByYear, filterEventsByYear };
