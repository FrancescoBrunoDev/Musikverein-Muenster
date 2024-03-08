import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { exibitionName: string } }) {
	try {
		const exibition = await import(`../markdown/${params.exibitionName}.md`);
		return {
			content: exibition.default,
			meta: exibition.metadata
		};
	} catch (e) {
		error(404, `Could not find ${params.exibitionName}`);
	}
}
