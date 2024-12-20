import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { exhibitionName: string; locale: Locales } }) {
	try {
		const exibition = await import(
			`$routes/[locale]/exhibitions/markdown/${params.locale}/${params.exhibitionName}.md`
		);

		return {
			content: exibition.default,
			meta: exibition.metadata,
			locale: params.locale,
			exhibitionName: params.exhibitionName
		};
	} catch (e) {
		error(404, `Could not find ${params.exhibitionName}`);
	}
}
