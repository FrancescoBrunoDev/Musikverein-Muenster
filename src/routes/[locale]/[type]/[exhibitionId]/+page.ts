import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ params, data }) => {
	try {
		if (params.type === 'exhibitions') {
			const md = await import(
				`$routes/[locale]/[type]/markdown/${params.locale}/${params.exhibitionId}.md`
			);
			return {
				content: md.default,
				meta: md.metadata,
				locale: params.locale,
				exhibitionId: params.exhibitionId,
				type: params.type
			};
		} else if (params.type === 'preview') {
			// Importa il primo file dalla cache
			// return just the file 
			let cachedFile;
			// find in data.exhibition?.expand. the file with the same lang as params.locale
			// then set cachedFile to the id of that file
			data.exhibition?.expand?.files.forEach((file: { lang: string; id: any; }) => {
				console.log(file.lang, params.locale);
				if (file.lang === params.locale) {
					cachedFile = file.id;
				}
			})
			if (cachedFile === undefined) {
				//TODO: redirect to 404 missing language
				goto('/404');
			}
			// console.log('cachedFile', `$routes/[locale]/[type]/markdown/.cache/${params.locale}/${cachedFile}.md`);
			const md = await import(`$routes/[locale]/[type]/markdown/.cache/${params.locale}/${cachedFile}.md`);

			return {
				content: md.default,
				meta: md.metadata,
				locale: params.locale,
				exhibitionId: params.exhibitionId,
				type: params.type,
				exhibition: data.exhibition
			};
		}
	} catch (e) {
		console.error('Error:', e);
		throw error(404, `Could not find ${params.exhibitionId}`);
	}
};
