import type { Gallery } from '$components/markdown/gallery/types';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { formatMD } from '$lib/utils';

export const POST: RequestHandler = async ({ request, locals, params, fetch }) => {
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
	} else if (params.operation === 'getGallery') {
		return getGallery({ locals, request });
	} else if (params.operation === 'getExhibitionsList') {
		return getExhibitionsList({ locals, fetch });
	}
	throw error(400, {
		message: 'Invalid operation'
	});
};

async function getExhibitionsList({ locals, fetch }: {
	locals: App.Locals, fetch: {
		(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
		(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
	}
}) {
	const exhibitions = await locals.pb.collection('exhibitions').getFullList({
		expand: 'files',
	});
	if (!exhibitions) {
		throw error(500, {
			message: 'Failed to get exhibitions'
		});
	}
	const filesArray = await Promise.all(
		exhibitions.flatMap(async (exhibition: any) =>
			await Promise.all(
				exhibition.expand.files
					.filter((file: any) => file.live && file.lang === locals.locale)
					.map(async (file: any) => {
						const url = locals.pb.files.getURL(file, file.live);
						const markdown = await fetch(url).then((res) => res.text());
						const formattedMd = formatMD({ markdown });

						return {
							metadata: formattedMd.metadata,
							title: exhibition.title,
							id: exhibition.id
						};
					})
			)
		)
	).then(arrays => arrays.flat());

	return json({ success: true, exhibitions: filesArray }, { status: 200 });
}

async function getGallery({ locals, request }: { locals: App.Locals; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		const gallery = await locals.pb.collection('galleries').getOne(id, {
			expand: 'images'
		});
		if (!gallery) {
			throw error(500, {
				message: 'Failed to get gallery'
			});
		}
		const images = gallery?.expand?.images;
		if (!images) {
			const GalleryArray: Gallery = {
				id: gallery.id,
				title: gallery.title,
				cover: locals.pb.files.getURL(gallery, gallery.cover),
				caption: gallery.caption,
				images: []
			};
			return json({ success: true, gallery: GalleryArray }, { status: 200 });
		}
		const imagesArray = images.map((image: any) => {
			return {
				caption: image.caption,
				src: locals.pb.files.getURL(image, image.src)
			};
		});
		const GalleryArray: Gallery = {
			id: gallery.id,
			title: gallery.title,
			cover: locals.pb.files.getURL(gallery, gallery.cover),
			caption: gallery.caption,
			images: imagesArray
		};
		return json({ success: true, gallery: GalleryArray }, { status: 200 });
	} catch (e) {
		throw error(400, {
			message: 'Error retrieving gallery'
		});
	}
}

async function updateFile({ request, locals }: { request: Request; locals: App.Locals }) {
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

async function changeEditingBy({ locals, request }: { locals: App.Locals; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		// clean the other files you are editing
		const files = await locals.pb.collection('exhibitionsFiles').getFullList({
			filter: `editingBy = "${locals.pb.authStore.record?.id}"`
		});
		if (files) {
			files.forEach(async (file: any) => {
				await locals.pb.collection('exhibitionsFiles').update(file.id, {
					editingBy: ''
				});
			});
		}
		const data = {
			editingBy: locals.pb.authStore.record?.id
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

async function deleteExhibition({ locals, request }: { locals: App.Locals; request: Request }) {
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

async function publishFile({ locals, request }: { locals: App.Locals; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		const file = await locals.pb.collection('exhibitionsFiles').getOne(id);
		const url = locals.pb.files.getURL(file, file.preview);
		const markdown = await fetch(url).then((res) => res.text());
		const fileLive = await locals.pb.collection('exhibitionsFiles').update(id, {
			live: [new File([markdown], 'preview.md', { type: 'text/markdown' })],
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

async function unpublishFile({ locals, request }: { locals: App.Locals; request: Request }) {
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

async function deleteFile({ locals }: { locals: App.Locals }) {
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
