import { redirect } from '@sveltejs/kit';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import type { PageServerLoad } from './$types';

const CACHE_DIR = 'src/.mdcache';

export const load = (async ({ locals, params, fetch }) => {
	if (params.type === 'preview' && !locals.pb.authStore.record) {
		return redirect(303, '/login');
	}
	// return the infos about the user

	let exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
		expand: 'files',
	});
	let existingMetadata: { [key: string]: { [key: string]: string } } = {};
	let metadataJSON: { [key: string]: { [key: string]: number } } = {};

	// make temorary directory and mamke metadata if not exists
	await mkdir(CACHE_DIR, { recursive: true });

	try {
		const metadataContent = await readFile(join(CACHE_DIR, 'metadata.json'), 'utf-8');
		existingMetadata = JSON.parse(metadataContent);
	} catch (error) {
		// File non esistente, continua con metadata vuoto
		console.error('Metadata file not found');
		existingMetadata = {};
	}
	if (exhibition.expand && exhibition.expand.files) {
		for (let file of exhibition.expand.files) {
			await mkdir(join(CACHE_DIR, file.lang), { recursive: true });
			// Controlla se il file necessita aggiornamento
			const cachedDate = existingMetadata[file.lang]?.[file.id];
			const fileDate = new Date(file.previewUpdated).getTime();
			const cachedDateTime = cachedDate || 0;
			const needsUpdate = !cachedDate || fileDate > Number(cachedDateTime);

			if (needsUpdate) {
				const url = locals.pb.files.getURL(file, file.preview);
				const response = await fetch(url);
				const content = await response.text();

				if (!metadataJSON[file.lang]) {
					metadataJSON[file.lang] = {};
				}
				metadataJSON[file.lang][file.id] = new Date(fileDate).getTime();

				const cachePath = join(CACHE_DIR, file.lang, `${file.id}.md`);
				await writeFile(cachePath, content);
			} else {
				// Mantieni il metadata esistente se il file non è stato aggiornato
				if (!metadataJSON[file.lang]) {
					metadataJSON[file.lang] = {};
				}
				metadataJSON[file.lang][file.id] = new Date(cachedDateTime).getTime();
			}
		}
	}

	// create the JSON
	const metadataPath = join(CACHE_DIR, 'metadata.json');
	await writeFile(metadataPath, JSON.stringify(metadataJSON));

	return {
		exhibition,
	};
}) satisfies PageServerLoad;
