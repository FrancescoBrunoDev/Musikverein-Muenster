import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/exhibitions/getMarkdown/${params.locale}`);
	const exhibitions: exhibitionMarkdown[] = await response.json();
	return { exhibitions, locale: params.locale };
};
