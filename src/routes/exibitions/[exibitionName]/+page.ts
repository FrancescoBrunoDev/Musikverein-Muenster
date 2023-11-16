import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const post = await import(`../markdown/${params.exibitionName}.md`);
		console.log(post);
		return {
			content: post.default,
			meta: post.metadata
		};
	} catch (e) {
		throw error(404, `Could not find ${params.exibitionName}`);
	}
}
