import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const exibition = await import(`../markdown/${params.exibitionName}.md`);
		return {
			content: exibition.default,
			meta: exibition.metadata
		};
	} catch (e) {
		throw error(404, `Could not find ${params.exibitionName}`); 
	}
}
