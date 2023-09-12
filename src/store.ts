import { writable } from "svelte/store";
import { joinEventByYear } from "./routes/dataMusiconn";
import { _ } from "$env/static/private";

const filters = writable<Filter[]>([]);
const fetchedEvents = writable<Events[]>(undefined);
const filteredEvents = writable([]);
const filteredEventsForGraph = writable([]);
const entitiesForSearchBox = writable<Entities[]>([
  "person",
  "corporation",
  "work",
]);

const addFilterElement = (selected: any) => {
  const filter: Filter = {
    name: selected.suggestion[0],
    entity: selected.suggestion[1],
    id: selected.suggestion[2],
  };

  if (filter.entity == "person") {
    filter.entity = isMoreAPersonOrAComposer(filter.id);
  }

  filters.update((currentFilters) => {
    const filterExists = currentFilters.some(
      (f) => f.id === filter.id && f.entity === filter.entity
    );
    if (filterExists) {
      return currentFilters;
    } else {
      return [...currentFilters, filter];
    }
  });

  updateFilteredEventsAndUdateDataForGraph();
};

const isMoreAPersonOrAComposer = (id: string) => {
  const personId = id.toString();
  let _fetchedEvents: Events[] = [];
  fetchedEvents.subscribe((res) => {
    _fetchedEvents = res;
  });
  let countPerson = 0;
  let countComposer = 0;
  for (const key in _fetchedEvents) {
    const events = _fetchedEvents[key];
    for (const event of events) {
      const persons = event.persons;
      if (persons.length > 0) {
        for (const person of persons) {
          if (person.person.toString() === personId) {
            countPerson++;
          }
        }
      }
      const performances = event.performances;
      if (performances) {
        for (const performance of performances) {
          const composers = performance.composers;
          if (composers) {
            for (const composer of composers) {
              if (composer.person.toString() === personId) {
                countComposer++;
              }
            }
          }
        }
      }
    }
  }
  if (countPerson > countComposer) {
    return "person";
  } else {
    return "composer";
  }
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

const updateEntitiesForSearchBox = (selected: string) => {
  entitiesForSearchBox.update((currentEntities) => {
    if (currentEntities.includes(selected)) {
      const index = currentEntities.indexOf(selected);
      currentEntities.splice(index, 1);
    } else {
      currentEntities.push(selected);
    }
    return currentEntities;
  });
};

const changeFilterPersonOrComposer = (selectedId: any, selectedEntity: any) => {
  filters.update((currentFilters) => {
    const filterToChange = currentFilters.find(
      (f) => f.id === selectedId && f.entity === selectedEntity
    );
    const actualState = filterToChange.entity;
    const newState = actualState === "person" ? "composer" : "person";
    const thereIsAnotherFilterWithSameIdAndEntity = currentFilters.some(
      (f) => f.id === selectedId && f.entity === newState
    );
    if (thereIsAnotherFilterWithSameIdAndEntity) {
      const filterToRemove = currentFilters.find(
        (f) => f.id === selectedId && f.entity === actualState
      );
      const index = currentFilters.indexOf(filterToRemove);
      currentFilters.splice(index, 1);
    }

    filterToChange.entity = newState;
    return currentFilters;
  });
  updateFilteredEventsAndUdateDataForGraph();
};

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
                  filter.entity === "composer" &&
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

          for (const person of event.persons) {
            if (
              filter.entity === "person" &&
              filter.id === person.person.toString()
            ) {
              hasMatchingPerformance = true;
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
  entitiesForSearchBox,
  addFilterElement,
  removeFilterElement,
  changeFilterPersonOrComposer,
  fetchAndStoreEvents,
  updateFilteredEventsAndUdateDataForGraph,
  updateEntitiesForSearchBox,
};
