import type { BaseTranslation } from '../i18n-types';

const en = {
	filters: {
		search: 'Search',
		methods: {
			or: 'or',
			and: 'and',
			not: 'not'
		},
		entities: {
			person: 'Person',
			work: 'Work',
			corporation: 'Corporation',
			location: 'Location',
			performances: 'Performances',
			composer: 'Composer',
			source: 'Source'
		},
		filter: {
			checkboxPerformanceEvent: "show the 'or' events as performances in the graph"
		},
		infoSearch: {
			title: 'Search Guide',
			description: 'Search for entities and events in the graph'
		}
	},
	events: {
		showAllPerformances: 'Show all performances',
		performedBy: 'Performed by'
	},
	navbar: {
		menu: 'Menu',
		home: 'Home',
		timeline: 'Timeline',
		exibitions: 'Exibitions',
		exibitionsNames: {
			first: 'First Exibition'
		}
	}
} satisfies BaseTranslation;

export default en;
