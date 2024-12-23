import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	if (params.operation === 'updateFile') {
		return updateFile({ request, locals });
	} else if (params.operation === 'deleteExhibition') {
		return deleteExhibition({ request, locals });
	} else if (params.operation === 'publishFile') {
		return publishFile({ request, locals });
	} else if (params.operation === 'changeEditingBy') {
		return changeEditingBy({ locals, request });
	} else if (params.operation === 'unpublishFile') {
		return unpublishFile({ locals, request });
	}
	throw error(400, {
		message: 'Invalid operation'
	});
};

async function updateFile({ request, locals }: { request: Request; locals: any }) {
	try {
		const body = await request.json();
		const { markdown, id, field, collection } = body;

		if (!markdown || !id) {
			throw error(400, {
				message: 'Markdown and id are required'
			});
		}

		const file = await locals.pb.collection(collection).update(String(id), {
			[field]: [new File([markdown], 'preview.md', { type: 'text/markdown' })],
			previewUpdated: new Date().toISOString()
		});

		if (!file) {
			throw error(500, {
				message: 'Failed to save file'
			});
		}

		return json({ success: true, updated: file }, { status: 200 });
	} catch (e) {
		throw error(400, {
			message: 'Errore durante il salvataggio'
		});
	}
}

async function changeEditingBy({ locals, request }: { locals: any; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		// clean the other files you are editing
		const files = await locals.pb.collection('exhibitionsFiles').getFullList({
			filter: `editingBy = "${locals.pb.authStore.record.id}"`
		});
		if (files) {
			files.forEach(async (file: any) => {
				await locals.pb.collection('exhibitionsFiles').update(file.id, {
					editingBy: ''
				});
			});
		}
		const data = {
			editingBy: locals.pb.authStore.record.id
		};
		// // update the file you are editing
		const file = await locals.pb
			.collection('exhibitionsFiles')
			.update(id, data, { requestKey: null });

		if (!file) {
			throw error(500, {
				message: 'Failed to save file'
			});
		}

		return json({ success: true, file }, { status: 200 });
	} catch (e) {
		throw error(400, {
			message: 'Errore durante il salvataggio'
		});
	}
}

async function deleteExhibition({ locals, request }: { locals: any; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		const exhibition = await locals.pb.collection('exhibitions').getOne(id);
		const stateElimination = await locals.pb.collection('exhibitions').delete(id);
		// delete the files
		const files = exhibition.files;
		files.forEach(async (file: any) => {
			await locals.pb.collection('exhibitionsFiles').delete(file);
		});
		if (!exhibition) {
			throw error(500, {
				message: 'Failed to delete exhibition'
			});
		}

		return json({ success: true, stateElimination }, { status: 200 });
	} catch (e) {
		throw error(400, {
			message: 'Errore durante la cancellazione'
		});
	}
}

async function publishFile({ locals, request }: { locals: any; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		const file = await locals.pb.collection('exhibitionsFiles').getOne(id);
		const url = locals.pb.files.getURL(file, file.preview);
		const fileLive = await locals.pb.collection('exhibitionsFiles').update(id, {
			live: [new File([url], 'preview.md', { type: 'text/markdown' })],
			liveUpdated: new Date().toISOString()
		});
		if (!file) {
			throw error(500, {
				message: 'Failed to delete file'
			});
		}

		return json({ success: true, updated: fileLive }, { status: 200 });
	} catch (e) {
		throw error(400, {
			message: 'Errore durante la cancellazione'
		});
	}
}

async function unpublishFile({ locals, request }: { locals: any; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		const file = await locals.pb.collection('exhibitionsFiles').getOne(id);
		const fileLive = await locals.pb.collection('exhibitionsFiles').update(id, {
			live: [],
			liveUpdated: ''
		});
		if (!file) {
			throw error(500, {
				message: 'Failed to delete file'
			});
		}

		return json({ success: true, updated: fileLive }, { status: 200 });
	} catch (e) {
		throw error(400, {
			message: 'Errore durante la cancellazione'
		});
	}
}

async function deleteFile({ locals }: { locals: any }) {
	try {
		//TODO: questo metodo bisogna finirlo
		const file = await locals.pb.collection('exhibitionsFiles').delete('id');
		if (!file) {
			throw error(500, {
				message: 'Failed to delete file'
			});
		}

		return json({ success: true, file }, { status: 200 });
	} catch (e) {
		throw error(400, {
			message: 'Errore durante la cancellazione'
		});
	}
}
