import { redirect } from '@sveltejs/kit';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { PageServerLoad } from './$types';

const CACHE_DIR = 'src/.mdcache';

export const load = (async ({ locals, params, fetch }) => {
	if (params.type === 'preview' && !locals.pb.authStore.record) {
		return redirect(303, '/login');
	}
	// return the infos about the user

	let cachedFiles = [];
	let exhibition;

	if (params.type === 'preview') {
		// make temorary directory

		exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
			expand: 'files'
		});

		if (exhibition.expand && exhibition.expand.files) {
			for (let file of exhibition.expand.files) {
				await mkdir(join(CACHE_DIR, file.lang), { recursive: true });
				// Ottieni URL del file
				const url = locals.pb.files.getURL(file, file.preview);
				// Scarica contenuto
				const response = await fetch(url);
				const content = await response.text();

				// Salva nella cache
				const cachePath = join(CACHE_DIR, file.lang, `${file.id}.md`);
				await writeFile(cachePath, content);

				cachedFiles.push(`${file.id}`);
			}
		}
	}

	return {
		exhibition,
		cachedFiles
	};
}) satisfies PageServerLoad;
