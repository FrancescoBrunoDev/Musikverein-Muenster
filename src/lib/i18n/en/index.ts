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
			performer: 'Performer',
			work: 'Work',
			corporation: 'Corporation',
			location: 'Location',
			performances: 'Performances',
			composer: 'Composer',
			source: 'Source'
		},
		filter: {
			checkboxPerformanceEvent: "show the 'or' events as performances in the graph",
			makeItBothComposerAndPerformer: 'both composer and performer',
			asA: 'as a'
		}
	},
	graphs: {
		line: 'Line',
		map: 'Map',
		pie: 'Pie',
		tab: 'Table'
	},
	events: {
		showAllPerformances: 'Show all performances',
		performedBy: 'Performed by',
		settings: {
			title: 'Settings',
			showMoreOptionsOnFilterOver: 'Show more options on filter over',
			showEventAsModal: 'Show event as modal'
		}
	},
	navbar: {
		menu: 'Menu',
		home: 'Home',
		database: 'Database',
		exhibitions: 'Exhibitions',
	},
	commons: {
		year: 'Year',
		hallo: 'Hi',
		codeLang: 'en-GB'
	},
	admin: {
		logout: 'Logout',
		preview: 'Preview',
		edit: 'Edit',
		delete: 'Delete',
		addNewExhibition: 'Add new exhibition',
		createNewExhibition: 'Create new exhibition',
		modifyExhibition: 'Modify exhibition',
		title: 'Title',
		noLang: 'no lang',
		publishedSuffix: ' - published',
		back: 'Back',
		publish: 'Publish',
		unpublish: 'Unpublish',
		revertToPublished: 'Revert to published',
		takeOverEditing: 'Take over editing',
		notPublishedYet: 'not published yet',
		lastPublish: 'last publish',
		lastSave: 'last save',
		editingBy: 'Editing by',
		deleteConfirm: 'Delete this exhibition and all its files? This cannot be undone.',
		deleting: 'Deleting…',
		errorDeleting: 'Error deleting exhibition',
		email: 'E-Mail',
		password: 'Password',
		login: 'Login',
		emailPlaceholder: 'mail@example.com',
		passwordPlaceholder: 'password'
	}
} satisfies BaseTranslation;

export default en;
