import type { Gallery } from '$components/markdown/gallery/types';
import { requireAdmin } from '$lib/auth.server';
import { formatMD } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const FILE_NAME = 'preview.md';

type Fetch = typeof globalThis.fetch;

export const POST: RequestHandler = async ({ request, locals, params, fetch }) => {
	// Mutating operations require the configured admin.
	// Read-only operations used by public pages stay public.
	if (params.operation !== 'getGallery' && params.operation !== 'getExhibitionsList') {
		requireAdmin(locals);
	}

	switch (params.operation) {
		case 'updateFile':
			return updateFile({ request, locals });
		case 'deleteExhibition':
			return deleteExhibition({ request, locals });
		case 'publishFile':
			return publishFile({ request, locals, fetch });
		case 'changeEditingBy':
			return changeEditingBy({ locals, request });
		case 'unpublishFile':
			return unpublishFile({ locals, request });
		case 'revertFile':
			return revertFile({ locals, request, fetch });
		case 'unlockFile':
			return unlockFile({ locals, request });
		case 'getGallery':
			return getGallery({ locals, request });
		case 'getExhibitionsList':
			return getExhibitionsList({ locals, fetch });
		default:
			return json({ success: false, message: 'Invalid operation' }, { status: 400 });
	}
};

async function unlockFile({ locals, request }: { locals: App.Locals; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		if (!id) {
			return json({ success: false, message: 'File id is required' }, { status: 400 });
		}

		const file = await locals.pb.collection('exhibitionsFiles').update(String(id), {
			editingBy: ''
		});

		return json({ success: true, file });
	} catch (e) {
		console.error('unlockFile failed:', e);
		return json({ success: false, message: 'Error while unlocking' }, { status: 400 });
	}
}

async function getExhibitionsList({ locals, fetch }: { locals: App.Locals; fetch: Fetch }) {
	const exhibitions = await locals.pb.collection('exhibitions').getFullList({
		expand: 'files'
	});

	const filesArray = await Promise.all(
		exhibitions.flatMap(
			async (exhibition: any) =>
				await Promise.all(
					(exhibition.expand?.files ?? [])
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
	).then((arrays) => arrays.flat());

	return json({ success: true, exhibitions: filesArray });
}

async function getGallery({ locals, request }: { locals: App.Locals; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		if (!id) {
			return json({ success: false, message: 'Gallery id is required' }, { status: 400 });
		}

		const gallery = await locals.pb.collection('galleries').getOne(id, {
			expand: 'images'
		});
		const images = (gallery?.expand?.images ?? []).map((image: any) => ({
			caption: image.caption,
			src: locals.pb.files.getURL(image, image.src)
		}));

		const galleryArray: Gallery = {
			id: gallery.id,
			title: gallery.title,
			cover: locals.pb.files.getURL(gallery, gallery.cover),
			caption: gallery.caption,
			images
		};
		return json({ success: true, gallery: galleryArray });
	} catch (e) {
		console.error('getGallery failed:', e);
		return json({ success: false, message: 'Error retrieving gallery' }, { status: 400 });
	}
}

async function updateFile({ request, locals }: { request: Request; locals: App.Locals }) {
	try {
		const body = await request.json();
		const { markdown, id } = body;

		if (!id || typeof markdown !== 'string') {
			return json({ success: false, message: 'Markdown and id are required' }, { status: 400 });
		}

		const current = await locals.pb.collection('exhibitionsFiles').getOne(String(id));
		if (current.editingBy && current.editingBy !== locals.pb.authStore.record?.id) {
			return json(
				{ success: false, locked: true, message: 'This file is being edited by someone else' },
				{ status: 423 }
			);
		}

		const file = await locals.pb.collection('exhibitionsFiles').update(String(id), {
			preview: [new File([markdown], FILE_NAME, { type: 'text/markdown' })],
			previewUpdated: new Date().toISOString(),
			editingBy: locals.pb.authStore.record?.id
		});

		return json({ success: true, updated: file });
	} catch (e) {
		console.error('updateFile failed:', e);
		return json({ success: false, message: 'Error while saving' }, { status: 400 });
	}
}

async function changeEditingBy({ locals, request }: { locals: App.Locals; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		if (!id) {
			return json({ success: false, message: 'File id is required' }, { status: 400 });
		}

		const currentUserId = locals.pb.authStore.record?.id;
		const target = await locals.pb.collection('exhibitionsFiles').getOne(String(id));

		if (target.editingBy && target.editingBy !== currentUserId) {
			return json(
				{ success: false, locked: true, message: 'This file is being edited by someone else' },
				{ status: 423 }
			);
		}

		// A user edits one file at a time: release any previous lock they held.
		const files = await locals.pb.collection('exhibitionsFiles').getFullList({
			filter: `editingBy = "${currentUserId}"`
		});
		await Promise.all(
			files.map((file: any) =>
				locals.pb.collection('exhibitionsFiles').update(file.id, { editingBy: '' })
			)
		);

		const file = await locals.pb.collection('exhibitionsFiles').update(String(id), {
			editingBy: currentUserId
		});

		return json({ success: true, file });
	} catch (e) {
		console.error('changeEditingBy failed:', e);
		return json({ success: false, message: 'Error while saving' }, { status: 400 });
	}
}

async function deleteExhibition({ locals, request }: { locals: App.Locals; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		if (!id) {
			return json({ success: false, message: 'Exhibition id is required' }, { status: 400 });
		}

		const exhibition = await locals.pb.collection('exhibitions').getOne(String(id));
		await locals.pb.collection('exhibitions').delete(String(id));

		await Promise.all(
			(exhibition.files ?? []).map((file: any) =>
				locals.pb.collection('exhibitionsFiles').delete(file)
			)
		);

		return json({ success: true });
	} catch (e) {
		console.error('deleteExhibition failed:', e);
		return json({ success: false, message: 'Error while deleting' }, { status: 400 });
	}
}

async function publishFile({
	locals,
	request,
	fetch
}: {
	locals: App.Locals;
	request: Request;
	fetch: Fetch;
}) {
	try {
		const body = await request.json();
		const { id } = body;
		if (!id) {
			return json({ success: false, message: 'File id is required' }, { status: 400 });
		}

		const file = await locals.pb.collection('exhibitionsFiles').getOne(String(id));
		const url = locals.pb.files.getURL(file, file.preview);
		const markdown = await fetch(url).then((res) => res.text());

		const fileLive = await locals.pb.collection('exhibitionsFiles').update(String(id), {
			live: [new File([markdown], FILE_NAME, { type: 'text/markdown' })],
			liveUpdated: new Date().toISOString()
		});

		return json({ success: true, updated: fileLive });
	} catch (e) {
		console.error('publishFile failed:', e);
		return json({ success: false, message: 'Error while publishing' }, { status: 400 });
	}
}

async function unpublishFile({ locals, request }: { locals: App.Locals; request: Request }) {
	try {
		const body = await request.json();
		const { id } = body;
		if (!id) {
			return json({ success: false, message: 'File id is required' }, { status: 400 });
		}

		const file = await locals.pb.collection('exhibitionsFiles').getOne(String(id));
		const fileLive = await locals.pb.collection('exhibitionsFiles').update(String(id), {
			live: [],
			liveUpdated: ''
		});

		return json({ success: true, updated: fileLive });
	} catch (e) {
		console.error('unpublishFile failed:', e);
		return json({ success: false, message: 'Error while unpublishing' }, { status: 400 });
	}
}

async function revertFile({
	locals,
	request,
	fetch
}: {
	locals: App.Locals;
	request: Request;
	fetch: Fetch;
}) {
	try {
		const body = await request.json();
		const { id } = body;
		if (!id) {
			return json({ success: false, message: 'File id is required' }, { status: 400 });
		}

		const file = await locals.pb.collection('exhibitionsFiles').getOne(String(id));
		if (!file.live) {
			return json(
				{ success: false, message: 'No published version to revert to' },
				{ status: 400 }
			);
		}

		const url = locals.pb.files.getURL(file, file.live);
		const markdown = await fetch(url).then((res) => res.text());

		const updated = await locals.pb.collection('exhibitionsFiles').update(String(id), {
			preview: [new File([markdown], FILE_NAME, { type: 'text/markdown' })],
			previewUpdated: new Date().toISOString()
		});

		return json({ success: true, updated });
	} catch (e) {
		console.error('revertFile failed:', e);
		return json({ success: false, message: 'Error while reverting' }, { status: 400 });
	}
}
