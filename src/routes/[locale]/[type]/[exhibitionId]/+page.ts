import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

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
			let fileObj: { lang: string; id: any } | undefined = data.exhibition?.expand?.files?.find((file: { lang: string; id: any }) => {
				return file.lang === params.locale;
			});

			if (!fileObj) {
				throw error(404, `Could not find ${params.exhibitionId}`);
			}

			const md = await import(`$mdcache/${params.locale}/${fileObj.id}.md`);

			return {
				content: md.default,
				meta: md.metadata,
				locale: fileObj?.lang ?? params.locale,
				fileObj,
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
