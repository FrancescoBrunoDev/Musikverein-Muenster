import { formatMD } from '$lib/utils';
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

	let file = exhibition?.expand?.files?.find(
		(file: { lang: string }) => file.lang === params.locale
	);
	let url = locals.pb.files.getURL(file, file.preview);
	const response = await fetch(url);
	const markdown = await response.text();

	const formattedMd = formatMD({ markdown });

	return {
		exhibition,
		type: params.type,
		locale: file?.lang ?? params.locale,
		fileObj: file,
		markdown: formattedMd
	};
}) satisfies PageServerLoad;
