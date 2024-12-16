import type { Translation } from '../i18n-types';

const de = {
	// this is an example Translation, just rename or delete this folder if you want
	filters: {
		search: 'Suche',
		methods: {
			or: 'oder',
			and: 'und',
			not: 'nicht'
		},
		entities: {
			person: 'Person',
			performer: 'Interpret',
			work: 'Werk',
			corporation: 'Körperschaft',
			location: 'Ort',
			performances: 'Aufführungen',
			composer: 'Komponist',
			source: 'Quelle'
		},
		filter: {
			checkboxPerformanceEvent: "zeige die 'oder' Ereignisse als Aufführungen im Graphen",
			makeItBothComposerAndPerformer: 'sowohl Komponist als auch Interpret',
			asA: 'als'
		},
		infoSearch: {
			title: 'Suchanleitung',
			description: 'Suche nach Entitäten und Ereignissen im Graphen'
		}
	},
	events: {
		showAllPerformances: 'Zeige alle Aufführungen',
		performedBy: 'Aufgeführt von',
		settings: {
			title: 'Einstellungen',
			showMoreOptionsOnFilterOver: 'Zeige mehr Optionen bei Filterung',
			showEventAsModal: 'Zeige Ereignis als Modal'
		}
	},
	navbar: {
		menu: 'Menü',
		home: 'Home',
		timeline: 'Datenbank',
		exibitions: 'Ausstellungen',
		exibitionsNames: {
			first: 'Chronik'
		}
	}
} satisfies Translation;

export default de;
