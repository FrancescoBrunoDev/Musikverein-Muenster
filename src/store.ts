import { writable } from "svelte/store";
import { joinEventByYear } from "./routes/dataMusiconn";
import { _ } from "$env/static/private";

const filters = writable<Filter[]>([]);
const fetchedEvents = writable<Events[]>(undefined);
const filteredEvents = writable([]);
const filteredEventsForGraph = writable([]);

const addFilterElement = (selected: any) => {
  const filter: Filter = {
    name: selected.suggestion[0],
    entity: selected.suggestion[1],
    id: selected.suggestion[2],
  };

  filters.update((currentFilters) => {
    const filterExists = currentFilters.some((f) => f.id === filter.id);
    if (filterExists) {
      return currentFilters;
    } else {
      return [...currentFilters, filter];
    }
  });
  updateFilteredEventsAndUdateDataForGraph();
};

const removeFilterElement = (selected: string) => {
  filters.update((currentFilters) => {
    const filterToRemove = currentFilters.find((f) => f.id === selected);
    const index = currentFilters.indexOf(filterToRemove);
    currentFilters.splice(index, 1);
    return currentFilters;
  });
  updateFilteredEventsAndUdateDataForGraph();
};

// da sistemare
const fetchAndStoreEvents = async () => {
  let eventsByYear;

  if (eventsByYear === undefined) {
    eventsByYear = await joinEventByYear().then((res: any) => {
      fetchedEvents.set(res);
      return res;
    });
  }
};

const updateFilteredEventsAndUdateDataForGraph = async () => {
  let _filters;
  filters.subscribe((res) => {
    _filters = res;
  });
  let _fetchedEvents: Events[] = [];
  fetchedEvents.subscribe((res) => {
    _fetchedEvents = res;
  });

  filteredEventsForGraph.set([]);
  filteredEvents.set([]);

  for (const key in _fetchedEvents) {
    const year = Number(key);
    const events = _fetchedEvents[key];
    const eventCount = events.length; // questo è da cambiare con la somma dei risultati dei filtri
    const yearObj: DataRecordCoordinates = {
      x: year,
      filters: {},
      eventCount: eventCount,
    };

    for (const filter of _filters) {
      let filterCount = 0;

      for (const event of events) {
        const performances = event.performances || [];
        if (performances.length > 0) {
          let hasMatchingPerformance = false;

          for (const performance of performances) {
            // se composers esiste controlla se hasMatchingPerformance
            if (performance.composers) {
              for (const composer of performance.composers) {
                if (
                  filter.entity === "person" &&
                  filter.id === composer.person.toString()
                ) {
                  hasMatchingPerformance = true;
                }
              }
            }

            // controlla se work hasMatchingPerformance
            if (
              filter.entity === "work" &&
              filter.id === performance.work.toString()
            ) {
              hasMatchingPerformance = true;
            }

            // controlla se corporations esiste e controlla se hasMatchingPerformance
            if (performance.corporations) {
              for (const corporation of performance.corporations) {
                if (
                  filter.entity === "corporation" &&
                  filter.id === corporation.corporation.toString()
                ) {
                  hasMatchingPerformance = true;
                }
              }
            }
          }

          if (hasMatchingPerformance) {
            filterCount++;
            filteredEvents.update((currentEvents) => {
              currentEvents[year] = currentEvents[year] || [];
              currentEvents[year].push(event);
              return { ...currentEvents }; // Return a copy of the modified object
            });
          }
        }
      }

      yearObj.filters[filter.name] = filterCount;
    }

    filteredEventsForGraph.update((currentEvents) => {
      return [...currentEvents, yearObj];
    });
  }
};

export {
  filters,
  fetchedEvents,
  filteredEvents,
  filteredEventsForGraph,
  addFilterElement,
  removeFilterElement,
  fetchAndStoreEvents,
  updateFilteredEventsAndUdateDataForGraph,
};
