import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const exhibitions = await getExhibitions({ fetch });
	return { exhibitions, locale: params.locale };
};

async function getExhibitions({
	fetch
}: {
	fetch: {
		(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
		(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
	};
}) {
	const response = await fetch(`/api/exhibitions/pb/getExhibitionsList`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();

	// if data.success is true
	if (!data.success || !data.exhibitions) {
		return [];
	}
	return data.exhibitions;
}
