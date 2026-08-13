import { requireAdmin } from '$lib/auth.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params, fetch }) => {
	requireAdmin(locals);

	const exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
		expand: 'files'
	});

	const fileObj = await locals.pb.collection('exhibitionsFiles').getOne(params.fileId, {
		expand: 'editedBy'
	});
	if (!fileObj) throw error(404, { message: 'File not found' });

	// The file must belong to the exhibition being edited.
	if (!exhibition.files?.includes(fileObj.id)) {
		throw error(404, { message: 'File not found' });
	}

	const url = locals.pb.files.getURL(fileObj, fileObj.preview);
	const response = await fetch(url);
	const content = await response.text();

	const isLocked = fileObj.editingBy !== '' && fileObj.editingBy !== locals.pb.authStore.record!.id;

	return {
		exhibition,
		markdown: content,
		file: fileObj,
		isLocked
	};
}) satisfies PageServerLoad;
