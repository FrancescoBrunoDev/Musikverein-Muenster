import { requireAdmin } from '$lib/auth.server';
import { formatMD } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (params.type === 'preview') {
		requireAdmin(locals);
	}

	const exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
		expand: 'files'
	});

	const file = exhibition?.expand?.files?.find(
		(file: { lang: string }) => file.lang === params.locale
	);

	if (!file) {
		throw error(404, { message: 'No markdown file for this language' });
	}

	// Public pages show the published (`live`) file; the admin preview shows the draft.
	const field = params.type === 'preview' ? file.preview : file.live;
	if (!field) {
		throw error(404, { message: 'This article has not been published yet' });
	}

	const url = locals.pb.files.getURL(file, field);
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
