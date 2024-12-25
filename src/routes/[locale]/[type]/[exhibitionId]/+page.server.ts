import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (params.type === 'preview' && !locals.pb.authStore.record) {
		return redirect(303, '/login');
	}
	// return the infos about the user

	let exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
		expand: 'files'
	});

	return {
		exhibition
	};
}) satisfies PageServerLoad;
