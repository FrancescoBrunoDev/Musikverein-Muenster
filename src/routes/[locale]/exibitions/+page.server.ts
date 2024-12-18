import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/exibitions/getMarkdown/${params.locale}`);
	const exibitions: ExibitionMarkdown[] = await response.json();
	return { exibitions, locale: params.locale };
};
