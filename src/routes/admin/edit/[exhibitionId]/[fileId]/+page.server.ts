import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params, fetch }) => {
	if (!locals.pb.authStore.record) {
		return redirect(303, '/login');
	}

	// make temorary directory

	let exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
		expand: 'files'
	});

	if (exhibition.files) {
		let fileObj = await locals.pb.collection('exhibitionsFiles').getOne(params.fileId, {
			expand: 'editedBy'
		});
		// trow an error if the file does not exist
		if (!fileObj) throw error(404, { message: 'File not found' });

		let url = locals.pb.files.getURL(fileObj, fileObj.preview);

		let response = await fetch(url);
		let content = await response.text();
		let isLocked = false;

		if (fileObj.editingBy === locals.pb.authStore.record.id || fileObj.editingBy === '') {
			isLocked = false;
		} else if (fileObj.editingBy !== locals.pb.authStore.record.id) {
			isLocked = true;
		}

		return {
			exhibition,
			markdown: content,
			file: fileObj,
			isLocked
		};
	}
}) satisfies PageServerLoad;
