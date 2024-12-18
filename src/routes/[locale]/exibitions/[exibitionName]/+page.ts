import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { exibitionName: string; locale: Locales } }) {
	try {
		const exibition = await import(
			`$routes/[locale]/exibitions/markdown/${params.locale}/${params.exibitionName}.md`
		);
		return {
			content: exibition.default,
			meta: exibition.metadata,
			locale: params.locale,
			exibitionName: params.exibitionName
		};
	} catch (e) {
		error(404, `Could not find ${params.exibitionName}`);
	}
}
