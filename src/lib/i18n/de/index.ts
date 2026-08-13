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
		}
	},
	graphs: {
		line: 'Linie',
		map: 'Karte',
		pie: 'Kreisdiagramm',
		tab: 'Tabelle'
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
		database: 'Datenbank',
		exhibitions: 'Ausstellungen',
	},
	commons: {
		year: 'Jahr',
		hallo: 'Hallo',
		codeLang: 'de-DE'
	},
	admin: {
		logout: 'Abmelden',
		preview: 'Vorschau',
		edit: 'Bearbeiten',
		delete: 'Löschen',
		addNewExhibition: 'Neue Ausstellung hinzufügen',
		createNewExhibition: 'Neue Ausstellung erstellen',
		modifyExhibition: 'Ausstellung bearbeiten',
		title: 'Titel',
		noLang: 'keine Sprache',
		publishedSuffix: ' - veröffentlicht',
		back: 'Zurück',
		publish: 'Veröffentlichen',
		unpublish: 'Veröffentlichung aufheben',
		revertToPublished: 'Auf veröffentlichte Version zurücksetzen',
		takeOverEditing: 'Bearbeitung übernehmen',
		notPublishedYet: 'noch nicht veröffentlicht',
		lastPublish: 'zuletzt veröffentlicht',
		lastSave: 'zuletzt gespeichert',
		editingBy: 'Bearbeitet von',
		deleteConfirm:
			'Diese Ausstellung und alle zugehörigen Dateien löschen? Dies kann nicht rückgängig gemacht werden.',
		deleting: 'Löschen…',
		errorDeleting: 'Fehler beim Löschen der Ausstellung',
		email: 'E-Mail',
		password: 'Passwort',
		login: 'Anmelden',
		emailPlaceholder: 'mail@example.com',
		passwordPlaceholder: 'passwort'
	}
} satisfies Translation;

export default de;
